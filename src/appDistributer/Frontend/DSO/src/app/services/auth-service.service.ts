import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendRefreshToken } from '../models/sendRefreshToken';
import { RefreshTokenDto } from '../models/refreshTokenDto';
import { ResetPassword } from '../models/reset-password';
import { ForgotPassword } from '../models/forgotpassword';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl = enviroment.apiUrl;

  constructor(private http: HttpClient) {}
}
