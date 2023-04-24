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
@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private baseUrl: string = 'https://localhost:7156/api/Auth/';
  resetForm!: FormGroup;
  constructor(private http: HttpClient) {}
}
