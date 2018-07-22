import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { Get, Post } from './request-methods';
import { Path, Query, Format, Header, Body } from './parameters';
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

class TestClientPath extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/items/{id}' )
  public getItem( @Path( 'id' ) id?: number ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/items2/{id}' )
  public getItem2( @Path( 'id', { value: 7 } ) id?: number ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/items3/{id}/status/status-{statusName}.{ext}' )
  public getItem3(@Path( 'id' ) id: number,
                  @Path( 'statusName' ) statusName: string,
                  @Path( 'ext', 'json' ) ext?: string ): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClientQuery extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/items' )
  public getItems( @Query( 'page' ) page?: number ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/items2' )
  public getItems2( @Query( 'page', '20' ) page?: number ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/items3' )
  public getItems3( @Query('page' ) page: number,
                    @Query( 'size', 20 ) size?: string,
                    @Query( 'sort', 'asc' ) sort?: string ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsCSV' )
  public getItemsCSV( @Query( 'field', { format: Format.CSV } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsSSV' )
  public getItemsSSV( @Query( 'field', { format: Format.SSV } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsTSV' )
  public getItemsTSV( @Query( 'field', { format: Format.TSV } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsPIPES' )
  public getItemsPIPES( @Query( 'field', { format: Format.PIPES } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsMULTI' )
  public getItemsMULTI( @Query( 'field', { format: Format.MULTI } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClientHeader extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/items' )
  public getItems( @Header( 'page' ) page?: number ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/items2' )
  public getItems2( @Header( 'page', '20' ) page?: number ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/items3' )
  public getItems3( @Header( 'page' ) page: number,
                    @Header( 'size', 20 ) size?: string,
                    @Header( 'sort', 'asc' ) sort?: string ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsDefault' )
  public getItemsDefault( @Header( 'field' ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsCSV' )
  public getItemsCSV( @Header( 'field', { format: Format.CSV } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsSSV' )
  public getItemsSSV( @Header( 'field', { format: Format.SSV } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsTSV' )
  public getItemsTSV( @Header( 'field', { format: Format.TSV } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsPIPES' )
  public getItemsPIPES( @Header( 'field', { format: Format.PIPES } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/itemsMULTI' )
  public getItemsMULTI( @Header( 'field', { format: Format.MULTI } ) fields: string | string[] ): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClientBody extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Post( '/items' )
  public createItem( @Body body?: any ): Observable<HttpResponse<any>> {
    return null;
  }

  @Get( '/items2' )
  public createItem2( @Body body1?: any, @Body body2?: any ): Observable<HttpResponse<any>> {
    return null;
  }

}

describe( '@Path', () => {

  it( 'resolve Path variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.url } ) );
    } );
    const testClient  = new TestClientPath( requestMock );

    // Act
    const result = testClient.getItem( 5 );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/items/5' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve missing Path variable', () => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.url } ) );
    } );
    const testClient  = new TestClientPath( requestMock );

    try {
      // Act
      testClient.getItem();

      // Assert fail
     // assert.fail();
    } catch ( e ) {
      expect( e.message).toEqual( 'Missing path variable \'id\' in url /items/{id}' );
    }

  } );

  it( 'resolve default Path variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.url } ) );
    } );
    const testClient  = new TestClientPath( requestMock );

    // Act
    const result = testClient.getItem2();

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/items2/7' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve multiple Path variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.url } ) );
    } );
    const testClient  = new TestClientPath( requestMock );

    // Act
    const result = testClient.getItem3( 20, 'done' );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/items3/20/status/status-done.json' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );
} );

describe( '@Query', () => {

  it( 'resolve Query variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItems( 5 );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/items?page=5' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve missing Query variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItems();

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/items' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve default Query variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItems2();

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/items2?page=20' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve multiple Query variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItems3( 3, '20' );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/items3?sort=asc&size=20&page=3' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve Collection Format CSV', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItemsCSV( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/itemsCSV?field=name,desc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve Collection Format SSV', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItemsSSV( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/itemsSSV?field=name%20desc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve Collection Format TSV', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItemsTSV( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/itemsTSV?field=name%09desc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve Collection Format PIPES', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItemsPIPES( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/itemsPIPES?field=name%7Cdesc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve Collection Format MULTI', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { url: req.urlWithParams } ) );
    } );
    const testClient  = new TestClientQuery( requestMock );

    // Act
    const result = testClient.getItemsMULTI( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.url).toEqual( '/itemsMULTI?field=name&field=desc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );
} );

describe( '@Header', () => {

  it( 'resolve Header variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItems( 5 );

    // Assert
    result.subscribe( resp => {
      try {
        expect( <any> resp.headers.getAll( 'page' )).toEqual ([ '5' ] );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve missing Header variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItems();

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.headers.has( 'path' ) ).toBeFalsy();
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve default Header variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItems2();

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.headers.getAll( 'page' )).toEqual( [ '20' ] );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve multiple Header variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItems3( 3, '20' );

    // Assert
    result.subscribe( resp => {
      try {
        expect( <any> resp.headers.getAll( 'page' )).toEqual([ '3' ] );
        expect( resp.headers.getAll( 'sort' )).toEqual([ 'asc' ] );
        expect( resp.headers.getAll( 'size' )).toEqual( [ '20' ] );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve Collection', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItemsDefault( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.headers.get( 'field' )).toEqual( 'name,desc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve Collection Format CSV', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItemsCSV( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.headers.get( 'field' )).toEqual( 'name,desc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve Collection Format SSV', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItemsSSV( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.headers.get( 'field' )).toEqual( 'name desc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );

  it( 'resolve Collection Format TSV', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItemsTSV( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.headers.get( 'field' )).toEqual(  'name\tdesc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve Collection Format PIPES', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItemsPIPES( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.headers.get( 'field' )).toEqual(  'name|desc' );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve Collection Format MULTI', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { headers: req.headers } ) );
    } );
    const testClient  = new TestClientHeader( requestMock );

    // Act
    const result = testClient.getItemsMULTI( [ 'name', 'desc' ] );

    // Assert
    result.subscribe( resp => {
      try {
        expect( resp.headers.getAll( 'field' )).toEqual( [ 'name', 'desc' ] );
        done();
      } catch ( e ) {
        done( e );
      }
    } );

  } );
} );

describe( '@Body', () => {

  it( 'resolve Body variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { body: req.body } ) );
    } );
    const testClient  = new TestClientBody( requestMock );

    // Act
    const result = testClient.createItem( { name: 'Awesome Item' } );

    // Assert
    result.subscribe( resp => {
      try {
       expect( JSON.parse(resp.body)).toEqual( { name: 'Awesome Item' } );
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve missing Body variable', ( done: ( e?: any ) => void ) => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { body: req.body } ) );
    } );
    const testClient  = new TestClientBody( requestMock );

    // Act
    const result = testClient.createItem();

    // Assert
    result.subscribe( resp => {
      try {
        expect(( resp.body)).toBeNull();
        done();
      } catch ( e ) {
        done( e );
      }
    } );
  } );

  it( 'resolve 2 Body variable', () => {
    // Arrange
    const requestMock = new HttpMock( ( req: HttpRequest<any> ) => {
      return of( new HttpResponse<any>( { body: req.body } ) );
    } );
    const testClient  = new TestClientBody( requestMock );

    // Act
    try {
      testClient.createItem2( { name: 'first' }, { name: 'second' } );
      // asert fail
      // assert.fail();
    } catch ( e ) {
      expect( e.message).toEqual('Only one @Body is allowed' );
    }
  } );
} );
