import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, retry, throwError, timer } from 'rxjs';
import { ToastService } from '../toast/toast.service';
import { ValidationError } from '../exceptions/validation.error';

const MAX_NUMBER_OF_RETRY_NO_CONNECTION: number = 5;
const RETRY_DELAY: number = 1000;
const RETRY_ON_ERROR_CODES: number[] = [404, 500];

export function retryInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    retry({
      count: MAX_NUMBER_OF_RETRY_NO_CONNECTION,
      delay: (error: HttpErrorResponse, retryAttempt: number): Observable<number> => {
        // if maximum number of retries have been met
        // or response is a status code we don't wish to retry, throw error
        if (
          retryAttempt > MAX_NUMBER_OF_RETRY_NO_CONNECTION ||
          !RETRY_ON_ERROR_CODES.includes(error.status)
        ) {
          return throwError(() => error);
        }

        // retry after 1s, 2s, etc...
        return timer(retryAttempt * RETRY_DELAY);
      },
    })
  );
}

export function errorResponseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let error: Error;

      if (err.status === 0) {
        // Network err
        error = new Error('Connection error. Please check your internet connection');
      } else if (err.error?.message) {
        // Backend singular err
        error = new Error(err.error.message);
      } else if (err.error?.errors) {
        // Backend multiple fields validation err
        error = new ValidationError('Validation error', err.error.errors);
      } else {
        // Unhandled HTTP err
        error = new Error(`Error status ${err.status}`);
      }

      return throwError(() => error);
    })
  );
}
