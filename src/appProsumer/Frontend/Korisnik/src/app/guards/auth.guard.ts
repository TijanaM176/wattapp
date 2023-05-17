import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private cookie: CookieService, 
    private auth: AuthServiceService,
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.cookie.check("token"))
      {//ako token postoji
        // var token = this.cookie.get("token");

        let letUser = this.cookie.get('role') === 'Prosumer' ? true : false;
        if(!letUser)
        {
          this.cookie.deleteAll('/');
          this.router.navigate(["login"])
        }
        return letUser;
      }
      else
      {//ako token ne postoji vraca na login
        this.router.navigate(["login"])
        return false;
      }
  }
  
}
