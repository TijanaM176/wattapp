import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private baseUrl: string ="https://localhost:7156/api/Auth/";

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]>
  {
    return this.http.get<any>(this.baseUrl+'UsersProsumer');
  }
}
