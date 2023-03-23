import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { ResetPassword } from '../models/reset-password';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPassword } from '../models/forgotpassword';
@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private baseUrl:string="https://localhost:7156/api/Auth/";
  resetForm!: FormGroup;
  constructor(private http:HttpClient) { }
  forgotPass(email:string){
    return this.http.post<ForgotPassword>(`${this.baseUrl}forgot_passwordWorker?email=`+email,{});
  }
  sendResetPasswordLink(email:string){
    
    return this.http.post<any>(`${this.baseUrl}Send_E-mail?emailUser=`+email+`&messagetoClientHTML=`+`%3Ca%20href%3D%22http%3A%2F%2Flocalhost%3A4200%2Fresetpassword%22%3EReset%20password%3C%2Fa%3E`,{});//napraviti model u kom ce da bude i mail i telo htmla
  }
  resetPassword(resetPasswordObj:ResetPassword){
    return this.http.post<any>(`${this.baseUrl}reset_passwordWorker`,resetPasswordObj);
  }
}
