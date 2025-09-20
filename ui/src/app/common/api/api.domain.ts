import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

/**
 * The API Response is pretty flexible and not rigid
 * on success, theres always either message or data, not both
 * on fail, theres always a message containing error message
 */
export interface ApiResponse<T = void> {
  status: 'fail' | 'success';
  data?: T;
  message?: string;
}

export type ApiResult<T> = T extends string ? string : T;

export interface Chunk<T = any> {
  event: string;
  data: T;
}

export interface HttpOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  credentials?: RequestCredentials;
  keepalive?: boolean;
  priority?: RequestPriority;
  cache?: RequestCache;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  integrity?: string;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
  timeout?: number;
}
