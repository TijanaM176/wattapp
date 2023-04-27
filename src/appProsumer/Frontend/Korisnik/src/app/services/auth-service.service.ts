import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { environment } from 'src/enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private cookie: CookieService
  ) {}

  login(loginDto: any) {
    return this.http.post<any>(this.baseUrl + 'Auth/prosumerLogin', loginDto);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Auth/UsersProsumer');
  }

  refreshToken(refreshToken: SendRefreshToken) {
    return this.http.post<RefreshTokenDto>(
      this.baseUrl + 'Auth/refreshToken',
      refreshToken
    );
  }
}
