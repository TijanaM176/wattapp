import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { RefreshTokenDto } from '../models/refreshTokenDto';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl: string = 'https://localhost:7156/api/Auth/';

  constructor(private http: HttpClient) {}

  login(loginDto: any) {
    return this.http.post<any>(this.baseUrl + 'DSOLogin', loginDto);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any>(
      'https://localhost:7156/api/Prosumer/GetAllProsumers'
    );
  }

  refreshToken(refreshToken: SendRefreshToken) {
    return this.http.post<RefreshTokenDto>(
      this.baseUrl + 'refreshToken',
      refreshToken
    );
  }
}
