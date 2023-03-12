import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private cookie: CookieService) {}

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

    return next.handle(request);
  }
}
