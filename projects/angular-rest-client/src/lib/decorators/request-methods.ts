import { methodBuilder } from '../builders/request-builder';

export enum RequestMethod {

  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  JSONP = 'JSONP'

}

/**
 * Get method
 * @param  url - resource url of the method
 */
export const Get: (url: string) => any = methodBuilder( RequestMethod.GET );

/**
 * Post method
 * @param  url - resource url of the method
 */
export const Post: (url: string) => any = methodBuilder( RequestMethod.POST );

/**
 * Put method
 * @param  url - resource url of the method
 */
export const Put: (url: string) => any = methodBuilder( RequestMethod.PUT );

/**
 * Patch method
 * @param  url - resource url of the method
 */
export const Patch: (url: string) => any = methodBuilder( RequestMethod.PATCH );

/**
 * Delete method
 * @param  url - resource url of the method
 */
export const Delete: (url: string) => any = methodBuilder( RequestMethod.DELETE );

/**
 * Head method
 * @param  url - resource url of the method
 */
export const Head: (url: string) => any = methodBuilder( RequestMethod.HEAD );

/**
 * Options method
 * @param url - resource url of the method
 */
export const Options: (url: string) => any = methodBuilder( RequestMethod.OPTIONS );

/**
 * JSONP method
 * @param  url - resource url of the method
 */
export const JsonP: (url: string) => any = methodBuilder( RequestMethod.JSONP );

