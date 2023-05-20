import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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
      if(this.cookie.check("tokenProsumer"))
      {//ako token postoji
        // var token = this.cookie.get("token");

        let letUser = this.cookie.get('role') === 'Prosumer' ? true : false;
        if(!letUser)
        {
          this.cookie.delete('tokenProsumer');
          this.cookie.delete('refreshProsumer');
          this.router.navigate(["login"])
        }
        else
        {
          this.auth.validateToken();
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
