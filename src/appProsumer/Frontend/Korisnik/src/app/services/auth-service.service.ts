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
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private cookie: CookieService,
    private router : Router
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

  logout()
  {
    let username = localStorage.getItem('usernameProsumer')!;
    let role = 'Prosumer'
    return this.http.put(this.baseUrl + 'Auth/Logout', {username, role});
  }

  validateToken()
  {
    let username = localStorage.getItem('usernameProsumer')!;
    let refreshDto = new SendRefreshToken(this.cookie.get('refreshProsumer'), username);
    this.refreshToken(refreshDto)
    .subscribe({
      next:(res)=>{
        this.cookie.delete('tokenProsumer', '/');
        this.cookie.delete('refreshProsumer', '/');
        this.cookie.set('tokenProsumer', res.token.toString().trim(), { path: '/' });
        this.cookie.set('refreshProsumer', res.refreshToken.toString().trim(), {
          path: '/',
        });
      },
      error:(err)=>{
        this.logout()
          .subscribe({
            next:(res)=>{
              this.toast.error('Session has expired. Please, log in again.', 'Error!', {timeOut:3000});
              this.cookie.delete('tokenProsumer', '/');
              this.cookie.delete('refreshProsumer', '/');
              localStorage.removeItem('usernameProsumer');
              localStorage.removeItem('roleProsumer');
              localStorage.removeItem('idProsumer');
              this.router.navigate(['login']);
            },
            error:(error)=>{
              console.log(error);
              this.toast.error('Unknown error occurred. Try again later.', 'Error!', {timeOut:2500});
              this.cookie.delete('tokenProsumer', '/');
              this.cookie.delete('refreshProsumer', '/');
              localStorage.removeItem('usernameProsumer');
              localStorage.removeItem('roleProsumer');
              localStorage.removeItem('idProsumer');
              this.router.navigate(['login']);
            }
          });
      }
    })
  }
}
