import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SendRefreshToken } from '../models/sendRefreshToken';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private cookie: CookieService, private router: Router, private auth : AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.cookie.check('token')) {
      //ako token postoji
      var token = this.cookie.get('token');

      let letUser = false; 
      if(this.cookie.get('role') == 'Admin' || this.cookie.get('role') == 'Dispatcher')
      {
        letUser = true;
      }
      this.auth.validateToken();
      return letUser;
    } else {
      //ako token ne postoji vraca na login
      this.router.navigate(['login']);
      return false;
    }
  }
}
