// common/api.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const ApiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error.error?.message) {
        return throwError(() => new Error(error.error.message));
      }
      return throwError(() => new Error(error.message || 'Unexpected error'));
    })
  );
};
