import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prosumer } from '../models/userstable';
import { lastValueFrom } from 'rxjs';
import { Neighborhood } from '../models/neighborhood';
import { City } from '../models/city';
@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {

  consumtion!:string;
  production!:string;

  constructor(private http: HttpClient) {}

  private baseUrl: string =
    'https://localhost:7156/api/Prosumer/GetAllProsumers';
  prosumers!: Prosumer[];
  private baseUrl2: string =
    'https://localhost:7156/api/Prosumer/getProsumerByID';
  private baseUrlPage: string =
    'https://localhost:7156/api/Prosumer/GetProsumersPaging';
  
  private deviceBaseUrl: string = 'https://localhost:7156/';
  
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
      'https://localhost:7156/api/Prosumer/GetNeighborhoodsByCityId?id=' + id
    );
  }

  getAllProsumers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(
      'https://localhost:7156/api/Prosumer/GetCities'
    );
  }
  getAllNeighborhoodByCityId(id: number): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(
      'https://localhost:7156/api/Prosumer/GetNeighborhoodsByCityId?id=' + id
    );
  }

  getCityNameById(id: number): Observable<string> {
    return this.http.get(
      'https://localhost:7156/api/Prosumer/GetCityNameById?id=' + id,
      { responseType: 'text' }
    );
  }

  getUserProductionAndConsumption(id: string):Observable<any>
  {
    //console.log(id);
    return this.http.get<any>(this.deviceBaseUrl+"ConsumptionAndProductionByProsumer?id="+id);
  }
}
