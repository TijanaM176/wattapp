import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { ResetPassword } from '../models/reset-password';
import { ForgotPassword } from '../models/forgotpassword';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7156/api/';
  constructor(private http: HttpClient) {}
  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}Auth/registerProsumer`, userObj);
  }
  signupWorker(workerDto: any) {
    return this.http.post<any>(
      `${this.baseUrl}Auth/registerDsoWorker`,
      workerDto
    );
  }
  setUserCoordinates(coordDto: any) {
    return this.http.put<any>(
      this.baseUrl + 'Prosumer/SetCoordinates',
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
  sendResetPasswordLink(email: string) {
    return this.http.post<any>(
      `${this.baseUrl}Auth/Send_E-mail?emailUser=` +
        email +
        `&messagetoClientHTML=` +
        `%3Ca%20href%3D%22http%3A%2F%2Flocalhost%3A4200%2Fresetpassword%22%3EReset%20password%3C%2Fa%3E`,
      {}
    ); //napraviti model u kom ce da bude i mail i telo htmla
  }
  resetPassword(resetPasswordObj: ResetPassword) {
    return this.http.post<any>(
      `${this.baseUrl}Auth/reset_passwordWorker`,
      resetPasswordObj
    );
  }

  refreshToken(refreshToken: SendRefreshToken) {
    return this.http.post<RefreshTokenDto>(
      this.baseUrl + 'Auth/refreshToken',
      refreshToken
    );
  }
}
