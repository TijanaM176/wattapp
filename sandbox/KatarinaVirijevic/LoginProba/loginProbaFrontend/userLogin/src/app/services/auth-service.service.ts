import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

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

  validateJwt(token : string): Observable<boolean> //salje se na back da se validejtuje ispravnost tokena
  {
    let headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    return this.http.post<boolean>(this.baseUrl+"/auth/validate", {}, {headers: headers});
  }
}
