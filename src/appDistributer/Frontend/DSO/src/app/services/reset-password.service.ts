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
import { environment } from 'src/enviroments/enviroment';
@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private baseUrl = environment.apiUrl;
  resetForm!: FormGroup;
  constructor(private http: HttpClient) {}
}
