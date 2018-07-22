import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { Client } from './client';
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

@Client({
  serviceId: 'customer-service',
  baseUrl: '/api/v1/customers',
  headers: {
    'content-type': 'application/json'
  }
})
class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get('/test')
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

}

describe('@Client', () => {

  it('verify decorator attributes are added to the request', () => {
    // Arrange
    const requestMock = new HttpMock(() => {
      return of(new HttpResponse<any>({status: 200}));
    });
    const testClient = new TestClient(requestMock);

    // Assert
    expect(testClient.getServiceId()).toEqual('customer-service');
    expect(testClient.getBaseUrl()).toEqual('/api/v1/customers');
    expect(<any> testClient.getDefaultHeaders()).toEqual({
      'content-type': 'application/json'
    });

  });
});
