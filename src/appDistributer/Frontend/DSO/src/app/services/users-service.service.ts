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
  private baseUrl: string =
    'https://localhost:7156/api/Prosumer/GetAllProsumers';
  prosumers!: Prosumer[];
  private baseUrl2: string =
    'https://localhost:7156/api/Prosumer/getProsumerByID';
  private baseUrlPage: string =
    'https://localhost:7156/api/Dso/GetProsumersPaging';
  refreshList() {
    lastValueFrom(this.http.get(this.baseUrl)).then(
      (res) => (this.prosumers = res as Prosumer[])
    );
  }
  detailsEmployee(id: string) {
    return this.http.get(`${this.baseUrl2}` + `?id=` + id);
  }
  Page(page: number, pagesize: number) {
    return this.http.get(
      `${this.baseUrlPage}?PageNumber=` + page + `&PageSize=` + pagesize
    );
  }

  getAllNeighborhoods(): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(
      'https://localhost:7156/api/Prosumer/GetAllNeighborhoods'
    );
  }
  GetProsumersByNeighborhoodId(id: string): Observable<Prosumer[]> {
    return this.http.get<Prosumer[]>(
      'https://localhost:7156/api/Prosumer/GetProsumersByNeighborhoodId?id=' +
        id
    );
  }
  getAllCities(): Observable<Prosumer[]> {
    return this.http.get<any[]>(
      'https://localhost:7156/api/Prosumer/GetAllCities'
    );
  }
  getAllNeighborhoodByCityId(id: string): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(
      'https://localhost:7156/api/Prosumer/GetAllNeighborhoodById?' + id
    );
  }
}
