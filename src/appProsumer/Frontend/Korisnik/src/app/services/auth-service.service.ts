import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { SendRefreshToken } from '../models/sendRefreshToken';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl: string = 'https://localhost:7156/api/';

  constructor(private http: HttpClient) {}

  login(loginDto: any) {
    return this.http.post<any>(this.baseUrl + 'Auth/prosumerLogin', loginDto);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Auth/UsersProsumer');
  }

  refreshToken(refreshToken: SendRefreshToken) {
    return this.http.post<RefreshTokenDto>(
      this.baseUrl + 'refreshToken',
      refreshToken
    );
  }
}
