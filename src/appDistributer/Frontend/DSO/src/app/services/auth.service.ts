import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string =
    'https://localhost:7156/api/Prosumer/GetAllProsumers';
  constructor(private http: HttpClient) {}
  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}registerProsumer`, userObj);
  }
  signupWorker(workerDto: any) {
    return this.http.post<any>(`${this.baseUrl}registerDsoWorker`, workerDto);
  }
}
