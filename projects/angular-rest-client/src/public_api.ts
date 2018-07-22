/*
 * Public API Surface of angular-rest-client
 */

export * from './lib/angular-rest-client.service';
export * from './lib/angular-rest-client.module';

export {RestClient} from './lib/rest-client';

export {Client} from './lib/decorators/client';
export {Headers} from './lib/decorators/headers';
export {Map} from './lib/decorators/map';
export {Timeout} from './lib/decorators/timeout';
export {OnEmit} from './lib/decorators/on-emit';
export {Body, Header, Query, Path, PlainBody} from './lib/decorators/parameters';
export {MediaType, Produces} from './lib/decorators/produces';
export {Get, Post, Patch, Put, Delete, Head, Options, JsonP} from './lib/decorators/request-methods';
