import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {

  constructor(private cookie: CookieService, 
    private auth: AuthServiceService,
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.cookie.check("tokenProsumer"))
      {//ako token ne postoji
        
        return true;
      }
      else
      {//ako token postoji ide na home
        this.router.navigate([""])
        return false;
      }
  }
  
}
