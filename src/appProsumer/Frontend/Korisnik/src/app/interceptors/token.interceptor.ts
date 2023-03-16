import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { RefreshTokenDto } from '../models/refreshTokenDto';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private cookie: CookieService, private toast: NgToastService, private router: Router, private auth: AuthServiceService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if(this.cookie.check("token"))
    {//ako token postoji
      const userToken = this.cookie.get("token");

      //uzimamo token i dodajemo ga u header zahteva
      request = request.clone(
        {
          setHeaders: {Authorization: "Bearer "+userToken}
        });
    }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        alert(err.status)
        if(err instanceof HttpErrorResponse)
        {
          if(err.status==401)
          {
            return this.handleAuth(request,next);
          }
        }
        return throwError(()=> new Error("Some other error occurred"));
      })
    );
  }

  handleAuth(request : HttpRequest<any>, next: HttpHandler)
  {
    return this.auth.refreshToken()
    .pipe(
      switchMap((data: string)=>
      {
        this.cookie.set("token",data);
        //this.cookie.set("refreshToken",data.refreshToken);
        alert(this.cookie.get("token"));
        //alert(this.cookie.get("refreshToken"));
        request = request.clone(
          {
            setHeaders: {Authorization: "Bearer "+this.cookie.get("token")}
          });
        return next.handle(request);
      }),
      catchError((err)=>{
        return throwError(()=>{
          this.toast.warning({detail:"Warning", summary: err.error,duration: 3000});
          this.cookie.deleteAll();
          this.router.navigate(['login']);
        })
      })
    )
  }
}
