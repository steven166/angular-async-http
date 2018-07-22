import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { Headers } from './headers';
import {Observable} from 'rxjs/internal/Observable';
import {of} from 'rxjs/internal/observable/of';



class HttpMock extends HttpClient {

  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor( private requestFunction: ( req: HttpRequest<any> ) => Observable<HttpResponse<any>> ) {
    super(null);
  }

  request<R>(req: HttpRequest<any>|any, p2?: any, p3?: any, p4?: any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }
  @Get( '/test' )
  @Headers( {
    'accept': 'application/json',
    'lang': [ 'en', 'nl' ]
  } )
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

}

describe( '@Headers', () => {

  it( 'verify decorator attributes are set', () => {
    // Arrange
    let headers: {
      [name: string]: any;
    };
    headers = null;
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      headers = req.headers;
      return of( new HttpResponse<any>( { status: 200 } ) );
    } );
    const testClient  = new TestClient( requestMock );

    // Act
    testClient.getItems();

    // Assert
    expect(headers.get('accept')).toEqual( 'application/json');
    expect(headers.get('lang')).toEqual( 'en,nl');

  } );
} );
