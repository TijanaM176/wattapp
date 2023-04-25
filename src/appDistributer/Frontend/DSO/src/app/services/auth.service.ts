import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { Observable } from 'rxjs';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { ResetPassword } from '../models/reset-password';
import { ForgotPassword } from '../models/forgotpassword';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string =
    'https://localhost:7156/api/Auth/';
  constructor(private http: HttpClient) {}
  signUp(userObj: any) {
    console.log(userObj);
    return this.http.post<any>(`https://localhost:7156/api/Auth/registerProsumer`,userObj);
  }
  signupWorker(workerDto: any) {
    return this.http.post<any>(`${this.baseUrl}registerDsoWorker`, workerDto);
   
  }
  setUserCoordinates(coordDto : any)
  {
    return this.http.put<any>("https://localhost:7156/api/Prosumer/SetCoordinates", coordDto);
  }
  login(loginDto: any) {
    return this.http.post<any>(this.baseUrl + 'DSOLogin', loginDto);
  }
  forgotPass(email:string){
    return this.http.post<ForgotPassword>(`${this.baseUrl}forgot_passwordWorker?email=`+email,{});
  }
  sendResetPasswordLink(email:string){
    
    return this.http.post<any>(`${this.baseUrl}Send_E-mail?emailUser=`+email+`&messagetoClientHTML=`+`%3Ca%20href%3D%22http%3A%2F%2Flocalhost%3A4200%2Fresetpassword%22%3EReset%20password%3C%2Fa%3E`,{});//napraviti model u kom ce da bude i mail i telo htmla
  }
  resetPassword(resetPasswordObj:ResetPassword){
    return this.http.post<any>(`${this.baseUrl}reset_passwordWorker`,resetPasswordObj);
  }

  refreshToken(refreshToken: SendRefreshToken) {
    return this.http.post<RefreshTokenDto>(
      this.baseUrl + 'Auth/refreshToken',
      refreshToken
    );
  }
}
