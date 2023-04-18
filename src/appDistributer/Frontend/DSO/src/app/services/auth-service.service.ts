import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { ResetPassword } from '../models/reset-password';
import { ForgotPassword } from '../models/forgotpassword';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl: string = 'https://localhost:7156/api/';

  constructor(private http: HttpClient) {}

 
}
