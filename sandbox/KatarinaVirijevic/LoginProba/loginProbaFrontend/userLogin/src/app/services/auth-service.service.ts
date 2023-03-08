import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  private baseUrl: string ="http://localhost:5259/api/Users/";
  constructor(private http: HttpClient) { }

  login(loginDto: any)
  {
    return this.http.post<any>(this.baseUrl+'login', loginDto);
  }
}
