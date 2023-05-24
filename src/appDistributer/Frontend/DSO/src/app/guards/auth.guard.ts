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
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private cookie: CookieService, 
    private router: Router, 
    private auth : AuthService,
    private toast : ToastrService
    ) {}

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
      let decodedToken: any = jwt_decode(this.cookie.get('token'));
      let role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].toString().trim();
      let letUser = (role == 'Admin' || role == 'Dispatcher') ? true : false; 
      if(!letUser)
      {
        this.auth.logout(localStorage.getItem('username')!, localStorage.getItem('role')!)
        .subscribe((res)=>{
          this.toast.error('Error!', 'Session expired. Please, log in again..', {timeOut: 3000});
          this.cookie.delete('token', '/');
          this.cookie.delete('refresh', '/');
          localStorage.removeItem('region');
          localStorage.removeItem('lat');
          localStorage.removeItem('long');
          localStorage.removeItem('username');
          localStorage.removeItem('role');
          localStorage.removeItem('id');
          this.router.navigate(['login']);
        });
      }
      else
      {
        this.auth.validateToken();
      }
      return letUser;
    } 
    else {
      //ako token ne postoji vraca na login
      this.router.navigate(['login']);
      return false;
    }
  }
}
