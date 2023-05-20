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
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  counter = 0;
  constructor(
    private cookie: CookieService,
    private router: Router,
    private auth: AuthService,
    public toast: ToastrService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.cookie.check('token'))
    {//ako token postoji
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

            return this.handleAuth(request, next);

          } else if (this.counter == 1) {

            console.log(this.cookie.get('username'), this.cookie.get('role'));

            this.auth.logout(this.cookie.get('username'), this.cookie.get('role'))
            .subscribe({
              next:(res)=>{
                this.counter = 0;
                this.toast.error(err.error, 'Error!', {timeOut: 3000});
                this.cookie.deleteAll('/');
                this.router.navigate(['login']);
              },
              error:(error)=>{
                console.log('logout', error);
                this.toast.error('Unknown error occurred.', 'Error!', {timeOut: 2500});
                this.cookie.deleteAll('/');
                this.router.navigate(['login']);
              }
            });
          }
        }
        return throwError(() => err);
      })
    );
  }

  private handleAuth(request: HttpRequest<any>, next: HttpHandler) {

    let refreshDto = new SendRefreshToken(this.cookie.get('refresh'), this.cookie.get('username'), this.cookie.get('role'));

    return this.auth.refreshToken(refreshDto).pipe(
      switchMap((data: RefreshTokenDto) => {
        this.counter = 0;

        this.cookie.delete('token', '/');
        this.cookie.delete('refresh', '/');
        this.cookie.set('token', data.token.toString().trim(), { path: '/' });
        this.cookie.set('refresh', data.refreshToken.toString().trim(), {
          path: '/',
        });

        request = request.clone({
          setHeaders: { Authorization: 'Bearer ' + this.cookie.get('token') },
          body: refreshDto,
        });

        return next.handle(request);
      }),
      catchError((err) => {
        if(err instanceof HttpErrorResponse && err.status == 401)
        {
          this.counter = 1;
          console.log('neautorizovano');
          console.log(err);
        }
        else
        {
          // this.toast.error('Unknown error occured.', 'Error!', { timeOut:3000 });
          console.log(err);
        }
        return throwError(() => err);
      })
    );
  }
}
