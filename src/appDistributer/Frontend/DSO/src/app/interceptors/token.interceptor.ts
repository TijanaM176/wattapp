import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  counter = 0;
  constructor(
    private cookie: CookieService,
    private router: Router,
    private auth: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.cookie.check('token')) {
      //ako token postoji
      const userToken = this.cookie.get('token');

      //uzimamo token i dodajemo ga u header zahteva
      request = request.clone({
        setHeaders: { Authorization: 'Bearer ' + userToken },
      });
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status == 401) {
          if (this.counter == 0) {
            this.counter = 1;
            return this.handleAuth(request, next);
          } else if (this.counter == 1) {
            this.counter = 0;
            this.cookie.deleteAll();
            this.router.navigate(['login']);
          }
        }
        return throwError(() => err);
      })
    );
  }

  handleAuth(request: HttpRequest<any>, next: HttpHandler) {
    let refreshDto = new SendRefreshToken();
    refreshDto.username = this.cookie.get('username');
    refreshDto.refreshToken = this.cookie.get('refresh');
    //console.log(refreshDto);
    return this.auth.refreshToken(refreshDto).pipe(
      switchMap((data: RefreshTokenDto) => {
        this.counter = 0;
        this.cookie.delete('token', '/');
        this.cookie.delete('refresh', '/');
        this.cookie.set('token', data.token.toString().trim(), { path: '/' });
        this.cookie.set('refresh', data.refreshToken.toString().trim(), {
          path: '/',
        });
        /*var decodedToken:any = jwt_decode(data.token);
        this.cookie.set('username',decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'].toString().trim());
        this.cookie.set('role',decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].toString().trim());*/
        request = request.clone({
          setHeaders: { Authorization: 'Bearer ' + this.cookie.get('token') },
        });
        return next.handle(request);
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
