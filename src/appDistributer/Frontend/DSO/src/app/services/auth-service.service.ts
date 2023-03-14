import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl: string ="https://localhost:7156/api/Auth/";

  constructor(private http: HttpClient) { }

  login(loginDto: any)
  {
    return this.http.post<any>(this.baseUrl+'DSOLogin', loginDto);
  }
}
