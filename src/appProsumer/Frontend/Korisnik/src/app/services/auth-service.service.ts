import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl: string ="https://localhost:7156/api/Auth/";

  constructor(private http: HttpClient, private toast: NgToastService) { }

  login(loginDto: any)
  {
    return this.http.post<any>(this.baseUrl+'prosumerLogin', loginDto);
  }

  getUsers(): Observable<any[]>
  {
    return this.http.get<any>(this.baseUrl+'UsersProsumer');
  }
}
