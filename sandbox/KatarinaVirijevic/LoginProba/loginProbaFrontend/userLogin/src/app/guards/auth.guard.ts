import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from '../services/auth-service.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private cookie: CookieService, 
    private auth: AuthServiceService,
    private router: Router){}

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
    
      if(this.cookie.check("token"))
      {//ako token postoji
        var token = this.cookie.get("token");
        //return this.auth.validateJwt(token) za sad ne postoji f-ja na beku da se proveri
        return true;
      }
      else
      {//ako token ne postoji vraca na login
        this.router.navigate(["login"])
        return false;
      }
    }
  
}
