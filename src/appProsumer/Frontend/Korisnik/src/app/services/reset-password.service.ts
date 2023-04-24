import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResetPassword } from '../models/reset-password';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ForgotPassword } from '../models/forgotpassword';
import { enviroment } from 'src/enviroments/enviroment';
@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private baseUrl = enviroment.apiUrl;
  resetForm!: FormGroup;
  constructor(private http: HttpClient) {}
  forgotPass(email: string) {
    return this.http.post<ForgotPassword>(
      `${this.baseUrl}Auth/forgot_passwordProsumer?email=` + email,
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
      `${this.baseUrl}Auth/reset_passwordProsumer`,
      resetPasswordObj
    );
  }
}
