import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';
import jwt_decode from 'jwt-decode';

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
        
        let decodedToken: any = jwt_decode(this.cookie.get('tokenProsumer'));
        let role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].toString().trim();
        let letUser = role === 'Prosumer' ? true : false;
        if(!letUser)
        {
          this.auth.logout()
          .subscribe({
            next:(res)=>{
              this.cookie.delete('tokenProsumer','/');
              this.cookie.delete('refreshProsumer','/');
              localStorage.removeItem('usernameProsumer');
              localStorage.removeItem('roleProsumer');
              localStorage.removeItem('idProsumer');
              this.router.navigateByUrl("login");
            },
            error:(err)=>{
              this.cookie.delete('tokenProsumer','/');
              this.cookie.delete('refreshProsumer','/');
              localStorage.removeItem('usernameProsumer');
              localStorage.removeItem('roleProsumer');
              localStorage.removeItem('idProsumer');
              this.router.navigateByUrl("login");
            }
          });
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
