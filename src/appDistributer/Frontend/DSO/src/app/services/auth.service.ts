import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { Observable } from 'rxjs';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { ResetPassword } from '../models/reset-password';
import { ForgotPassword } from '../models/forgotpassword';
import { environment } from 'src/enviroments/enviroment';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private cookie : CookieService, 
    private toast : ToastrService,
    private router : Router
    ) {}


  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}Auth/registerProsumer`, userObj);
  }
  signupWorker(workerDto: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}Auth/registerDsoWorker`,
      workerDto
    );
  }
  setUserCoordinates(coordDto: any) {
    return this.http.put<any>(
      `${this.baseUrl}Prosumer/SetCoordinates`,
      coordDto
    );
  }
  login(loginDto: any) {
    return this.http.post<any>(this.baseUrl + 'Auth/DSOLogin', loginDto);
  }
  forgotPass(email: string) {
    return this.http.post<ForgotPassword>(
      `${this.baseUrl}Auth/forgot_passwordWorker?email=` + email,
      {}
    );
  }
  sendResetPasswordLink(email: string, message: any) {
    return this.http.post<any>(
      `${this.baseUrl}Auth/Send_E-mail?emailUser=` +
        email +
        `&messagetoClientHTML=` +
        message,
      {}
    ); //napraviti model u kom ce da bude i mail i telo htmla
  }
  resetPassword(resetPasswordObj: ResetPassword) {
    return this.http.post<any>(
      `${this.baseUrl}Auth/reset_passwordWorker`,
      resetPasswordObj
    );
  }

  refreshToken(refreshToken: SendRefreshToken): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + 'Auth/refreshToken',
      refreshToken
    );
  }

  logout(username : string, role : string)
  {
    return this.http.put(this.baseUrl+'Auth/Logout', {username, role});
  }

  validateToken()
  {
    let refreshDto = new SendRefreshToken(this.cookie.get('refresh'), this.cookie.get('username'), this.cookie.get('role'));
    this.refreshToken(refreshDto).subscribe({
      next:(res)=>{
        this.cookie.delete('token', '/');
        this.cookie.delete('refresh', '/');
        this.cookie.set('token', res.token.toString().trim(), { path: '/' });
        this.cookie.set('refresh', res.refreshToken.toString().trim(), {
          path: '/',
        });
      },
      error:(err)=>{
        this.logout(this.cookie.get('username'), this.cookie.get('role'))
        .subscribe((res)=>{
          if(res)
          {
            this.cookie.deleteAll('/');
            this.toast.error('Session has expired. Please, log in again.','Error!', {timeOut:3000});
            this.router.navigate(['login']);
          }
          else
          {
            this.cookie.deleteAll('/');
            this.toast.error('Unknown error occurred. Try again later.','Error!', {timeOut:3000});
            this.router.navigate(['login']);
          }
        });
      }
    });
  }
}
