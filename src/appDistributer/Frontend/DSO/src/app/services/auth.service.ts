import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { Observable } from 'rxjs';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { ResetPassword } from '../models/reset-password';
import { ForgotPassword } from '../models/forgotpassword';
import { environment } from 'src/enviroments/enviroment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
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
}
