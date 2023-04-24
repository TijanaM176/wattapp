import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResetPassword } from '../models/reset-password';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { enviroment } from 'src/enviroments/enviroment';
import { ForgotPassword } from '../models/forgotpassword';
@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private baseUrl = enviroment.apiUrl;
  resetForm!: FormGroup;
  constructor(private http: HttpClient) {}
}
