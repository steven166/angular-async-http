import {
  HttpClient, HttpEvent,
  HttpHeaders as AngularHeaders,
  HttpParams,
  HttpRequest
} from '@angular/common/http';

import { RestClient } from '../rest-client';
import { Format } from '../decorators/parameters';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {timeout} from 'rxjs/operators';

export function methodBuilder( method: string ) {
  return function ( url: string ) {
    return function ( target: RestClient, propertyKey: string, descriptor: any ) {

      const pPath      = target[ `${propertyKey}_Path_parameters` ];
      const pQuery     = target[ `${propertyKey}_Query_parameters` ];
      const pBody      = target[ `${propertyKey}_Body_parameters` ];
      const pPlainBody = target[ `${propertyKey}_PlainBody_parameters` ];
      const pHeader    = target[ `${propertyKey}_Header_parameters` ];

      descriptor.value = function ( ...args: any[] ) {

        // Body
        let body: any = null;
        if ( pBody ) {
          if ( pBody.length > 1 ) {
            throw new Error( 'Only one @Body is allowed' );
          }
          let value = args[ pBody[ 0 ].parameterIndex ];
          if ( value === undefined && pBody[ 0 ].value !== undefined ) {
            value = pBody[ 0 ].value;
          }
          body = JSON.stringify( value );
        }
        if ( pPlainBody ) {
          if ( pPlainBody.length > 1 ) {
            throw new Error( 'Only one @Body is allowed' );
          }
          let value = args[ pPlainBody[ 0 ].parameterIndex ];
          if ( value === undefined && pPlainBody[ 0 ].value !== undefined ) {
            value = pPlainBody[ 0 ].value;
          }
          body = value;
        }
        // Path
        let resUrl: string = url;
        if ( pPath ) {
          for ( const k in pPath ) {
            if ( pPath.hasOwnProperty( k ) ) {
              let value: any = args[ pPath[ k ].parameterIndex ];
              if ( value === undefined && pPath[ k ].value !== undefined ) {
                value = pPath[ k ].value;
              }
              if ( value !== undefined && value !== null ) {
                resUrl = resUrl.replace( '{' + pPath[ k ].key + '}', value );
              } else {
                throw new Error( 'Missing path variable \'' + pPath[ k ].key + '\' in url ' + url );
              }
            }
          }
        }
        if ( this.getBaseUrl() !== null ) {
          let baseUrl = this.getBaseUrl();
          if ( baseUrl.indexOf( '/' ) === baseUrl.length - 1 && resUrl.indexOf( '/' ) === 0 ) {
            baseUrl = baseUrl.substring( 0, 1 );
          }
          resUrl = baseUrl + resUrl;
        }

        // Query
        let search: HttpParams = new HttpParams();
        if ( pQuery ) {
          pQuery
            .filter( ( p: any ) => args[ p.parameterIndex ] !== undefined || p.value !== undefined ) // filter out optional parameters
            .forEach( ( p: any ) => {
              const key        = p.key;
              let value: any = args[ p.parameterIndex ];
              if ( value === undefined && p.value !== undefined ) {
                value = p.value;
              }

              // if the value is a instance of Object, we stringify it
              if ( Array.isArray( value ) ) {
                switch ( p.format ) {
                  case Format.CSV:
                    value = value.join( ',' );
                    break;
                  case Format.SSV:
                    value = value.join( ' ' );
                    break;
                  case Format.TSV:
                    value = value.join( '\t' );
                    break;
                  case Format.PIPES:
                    value = value.join( '|' );
                    break;
                  case Format.MULTI:
                    value = value;
                    break;
                  default:
                    value = value.join( ',' );
                }
              } else if ( value instanceof Object ) {
                value = JSON.stringify( value );
              }
              if ( Array.isArray( value ) ) {
                value.forEach( v => search = search.append( key, v ) );
              } else {
                search = search.set( key, value );
              }
            } );
        }

        // Headers
        // set class default headers
        let headers: AngularHeaders = new AngularHeaders( this.getDefaultHeaders() );

        // set method specific headers
        for ( const k in descriptor.headers ) {
          if ( descriptor.headers.hasOwnProperty( k ) ) {
            if ( headers.has( k ) ) {
              headers = headers.append( k, descriptor.headers[ k ] + '' );
            } else {
              headers = headers.set( k, descriptor.headers[ k ] + '' );
            }
          }
        }
        // set parameter specific headers
        if ( pHeader ) {
          for ( const k in pHeader ) {
            if ( pHeader.hasOwnProperty( k ) ) {
              let value: any = args[ pHeader[ k ].parameterIndex ];
              if ( value === undefined && pHeader[ k ].value !== undefined ) {
                value = pHeader[ k ].value;
              }
              if ( Array.isArray( value ) ) {
                switch ( pHeader[ k ].format ) {
                  case Format.CSV:
                    value = value.join( ',' );
                    break;
                  case Format.SSV:
                    value = value.join( ' ' );
                    break;
                  case Format.TSV:
                    value = value.join( '\t' );
                    break;
                  case Format.PIPES:
                    value = value.join( '|' );
                    break;
                  case Format.MULTI:
                    value = value;
                    break;
                  default:
                    value = value.join( ',' );
                }
              }
              if ( Array.isArray( value ) ) {
                value.forEach( v => headers = headers.append( pHeader[ k ].key, v + '' ) );
              } else {
                headers = headers.append( pHeader[ k ].key, value + '');
              }
            }
          }
        }

        // Build Request
        const req: HttpRequest<any> = new HttpRequest( method, resUrl, body, {
          headers: headers,
          params: search,
          withCredentials: true
        } );

        // intercept the request
        this.requestInterceptor( req );
        // make the request and store the observable for later transformation
        let observable: Observable<HttpEvent<any>> = (<HttpClient>this.httpClient).request( req );

        // transform the observable in accordance to the @Produces decorator
        if ( descriptor.mime ) {
          observable = observable.pipe(map(descriptor.mime));
        }
        if ( descriptor.timeout ) {
          descriptor.timeout.forEach( ( time: number ) => {
            observable = observable.pipe(timeout( time ));
          } );
        }
        if ( descriptor.mappers ) {
          descriptor.mappers.forEach( ( mapper: ( resp: any ) => any ) => {
            observable = observable.pipe(map( mapper ));
          } );
        }
        if ( descriptor.emitters ) {
          descriptor.emitters.forEach( ( handler: ( resp: Observable<any> ) => Observable<any> ) => {
            observable = handler( observable );
          } );
        }

        // intercept the response
        observable = this.responseInterceptor( observable );

        return observable;
      };

      return descriptor;
    };
  };
}
