import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, OperatorFunction, map } from 'rxjs';
import { ApiResponse, ApiResult, Chunk, HttpOptions } from './api.domain';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private zone = inject(NgZone);

  private successHandler<T>(response: ApiResponse<T>): ApiResult<T> {
    if (response.data !== undefined && response.data !== null) {
      return response.data as ApiResult<T>;
    }
    return response.message as ApiResult<T>;
  }

  private pipeline<T>(): OperatorFunction<ApiResponse<T>, ApiResult<T>> {
    return (source) => source.pipe(map((res) => this.successHandler(res)));
  }

  /**
   * GET request
   * @param endpoint API endpoint
   * @param opts optional HttpOptions
   * @returns Observable
   */
  get<T>(endpoint: string, opts?: HttpOptions): Observable<ApiResult<T>> {
    return this.http
      .get<ApiResponse<T>>(`${environment.apiUrl}/${endpoint}`, opts)
      .pipe(this.pipeline());
  }

  /**
   * POST request
   * @param endpoint API endpoint
   * @param body request payload
   * @param opts optional HttpOptions
   * @returns Observable
   */
  post<T>(endpoint: string, body: any, opts?: HttpOptions): Observable<ApiResult<T>> {
    return this.http
      .post<ApiResponse<T>>(`${environment.apiUrl}/${endpoint}`, body, opts)
      .pipe(this.pipeline());
  }

  /**
   * GET Stream via Server-Sent Events
   * @param endpoint API endpoint
   * @param withCredentials boolean
   * @returns Observable emitting each parsed chunk
   */
  stream<T>(endpoint: string, withCredentials: boolean = false): Observable<Chunk<T>> {
    const url = `${environment.apiUrl}/${endpoint}`;

    return new Observable<Chunk<T>>((subscriber) => {
      const es = new EventSource(url, { withCredentials });
      es.addEventListener('message', (e: MessageEvent) => {
        this.zone.run(() => {
          try {
            const data = JSON.parse(e.data) as T;
            subscriber.next({ event: 'message', data });
          } catch (error) {
            subscriber.error(new Error('Failed to parse SSE data'));
          }
        });
      });

      es.addEventListener('done', (e: MessageEvent) => {
        this.zone.run(() => {
          subscriber.complete();
        });
      });

      es.addEventListener('error', () => {
        this.zone.run(() => {
          subscriber.error(new Error('SSE connection lost'));
        });
      });

      return () => es.close();
    });
  }
}
