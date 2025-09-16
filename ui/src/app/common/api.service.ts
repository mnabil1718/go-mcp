import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { ApiResponse } from './api.domain';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${environment.apiUrl}/${endpoint}`).pipe(
      map((res) => {
        if (res.data !== undefined) {
          return res.data;
        }
        throw new Error(res.message || 'Unknown error');
      })
    );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${environment.apiUrl}/${endpoint}`, body).pipe(
      map((res) => {
        if (res.data !== undefined) {
          return res.data;
        }
        throw new Error(res.message || 'Unknown error');
      })
    );
  }
}
