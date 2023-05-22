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
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { SendRefreshToken } from '../models/sendRefreshToken';
import jwt_decode from 'jwt-decode';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  counter = 0;
  constructor(
    private cookie: CookieService,
    private toast: ToastrService,
    private router: Router,
    private auth: AuthServiceService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.cookie.check('tokenProsumer')) {
      //ako token postoji
      const userToken = this.cookie.get('tokenProsumer');

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

          } 
          else if (this.counter == 1) {
            this.auth.logout()
            .subscribe({
              next:(res)=>{
                this.toast.error(err.error, 'Error!', {timeOut:3000});
                this.cookie.delete('tokenProsumer','/');
                this.cookie.delete('refreshProsumer','/');
                localStorage.removeItem('usernameProsumer');
                localStorage.removeItem('roleProsumer');
                localStorage.removeItem('idProsumer');
                this.counter = 0;
                this.router.navigate(['login']);
              },
              error:(error)=>{
                console.log(error);
                this.toast.error('Unknown error occurred.', 'Error!', {timeOut:2500});
                this.cookie.delete('tokenProsumer','/');
                this.cookie.delete('refreshProsumer','/');
                localStorage.removeItem('usernameProsumer');
                localStorage.removeItem('roleProsumer');
                localStorage.removeItem('idProsumer');
                this.counter = 0;
                this.router.navigate(['login']);
              }
            });
          }
        }
        return throwError(() => err);
      })
    );
  }

  handleAuth(request: HttpRequest<any>, next: HttpHandler) {
    let username = localStorage.getItem('usernameProsumer')!;
    let refreshDto = new SendRefreshToken(this.cookie.get('refreshProsumer'), username);
    return this.auth.refreshToken(refreshDto).pipe(
      switchMap((data: RefreshTokenDto) => {

        this.counter = 0;

        this.cookie.delete('tokenProsumer', '/');
        this.cookie.delete('refreshProsumer', '/');
        this.cookie.set('tokenProsumer', data.token.toString().trim(), { path: '/' });
        this.cookie.set('refreshProsumer', data.refreshToken.toString().trim(), {
          path: '/',
        });

        var decodedToken: any = jwt_decode(data.token);
        localStorage.setItem('usernameProsumer', decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        .toString().trim());

        localStorage.setItem('roleProsumer',decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        .toString().trim());
        
        localStorage.setItem('idProsumer', decodedToken['sub'].toString().trim());
        
        request = request.clone({
          setHeaders: { Authorization: 'Bearer ' + this.cookie.get('tokenProsumer') },
        });
        return next.handle(request);
      }),

      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
