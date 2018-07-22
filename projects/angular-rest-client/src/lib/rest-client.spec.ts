import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from './rest-client';
import { Get, RequestMethod } from './decorators/request-methods';
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

class TestClient1 extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

}

class TestClient2 extends RestClient {

  public interceptorCallCount = 0;
  public interceptorRequest: HttpRequest<any>;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  protected requestInterceptor( req: HttpRequest<any> ): void {
    this.interceptorCallCount++;
    this.interceptorRequest = req;
  }

}

class TestClient3 extends RestClient {

  public interceptorCallCount = 0;
  public interceptorResponse: Observable<any>;

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get( '/test' )
  public getItems(): Observable<Response> {
    return null;
  }

  protected responseInterceptor( res: Observable<HttpResponse<any>> ): Observable<any> {
    this.interceptorCallCount++;
    this.interceptorResponse = res;
    return res;
  }

}

describe( 'RestClient', () => {
  beforeEach( () => {
    // Nothing here yet.
  } );

  it( 'checkSetup', () => {
    // Arrange
    const requestMock = new HttpMock( () => {
      return of( new HttpResponse() );
    } );
    const testClient  = new TestClient1( requestMock );

    // Act
   testClient.getItems();

    // Assert
    expect( requestMock.callCount).toEqual( 1 );
    expect( requestMock.lastRequest.method).toEqual( RequestMethod.GET );

  } );

  it( 'call requestInterceptor', () => {
    // Arrange
    const requestMock = new HttpMock( () => {
      return of( new HttpResponse<any>( ) );
    } );
    const testClient  = new TestClient2( requestMock );

    // Act
    testClient.getItems();

    // Assert
    expect( testClient.interceptorCallCount).toEqual( 1 );
    expect( testClient.interceptorRequest.method).toEqual( RequestMethod.GET );

  } );

  it( 'call responseInterceptor', () => {
    // Arrange
    const requestMock = new HttpMock( () => {
      return of( new HttpResponse<any>( { status: 200 } ) );
    } );
    const testClient  = new TestClient3( requestMock );

    // Act
    const result = testClient.getItems();

    // Assert
    expect( testClient.interceptorCallCount).toEqual( 1 );

  } );
} );
