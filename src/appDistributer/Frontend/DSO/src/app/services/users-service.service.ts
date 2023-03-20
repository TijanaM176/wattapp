import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prosumer } from '../models/userstable';
import { lastValueFrom } from 'rxjs';
import { Neighborhood } from '../models/neighborhood';
@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = 'https://localhost:7156/api/Auth/UsersProsumer';
  prosumers!: Prosumer[];
  getAllData(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  refreshList() {
    lastValueFrom(this.http.get(this.baseUrl)).then(
      (res) => (this.prosumers = res as Prosumer[])
    );
  }

  getAllNeighborhoods(): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(
      'https://localhost:7156/api/Prosumer/GetAllNeighborhoods'
    );
  }
}
