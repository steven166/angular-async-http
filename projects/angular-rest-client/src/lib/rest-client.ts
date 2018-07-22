import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';

/**
 * Angular 4 RestClient class.
 *
 */
export class RestClient {

  public constructor(private httpClient: HttpClient) {
  }

  public getServiceId(): string {
    return null;
  }

  public getBaseUrl(): string {
    return null;
  }

  public getDefaultHeaders(): Object {
    return null;
  }

  /**
   * Request Interceptor
   *
   * @method requestInterceptor
   * @param  req - request object
   */
  protected requestInterceptor(req: HttpRequest<any>): void {
    //
  }

  /**
   * Response Interceptor
   *
   * @method responseInterceptor
   * @param  res - response object
   * @returns  res - transformed response object
   */
  protected responseInterceptor(res: Observable<HttpResponse<any>>): Observable<any> {
    return res;
  }

}
