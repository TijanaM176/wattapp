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
import { environment } from 'src/enviroment/enviroment';
@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private baseUrl = environment.apiUrl;
  resetForm!: FormGroup;
  constructor(private http: HttpClient) {}
  forgotPass(email: string) {
    return this.http.post<ForgotPassword>(
      `${this.baseUrl}Auth/forgot_passwordProsumer?email=` + email,
      {}
    );
  }
  sendResetPasswordLink(email: string,message:any) {
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
      `${this.baseUrl}Auth/reset_passwordProsumer`,
      resetPasswordObj
    );
  }
}
