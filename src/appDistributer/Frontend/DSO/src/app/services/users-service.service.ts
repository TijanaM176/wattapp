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
  consumtion!: string;
  production!: string;

  constructor(private http: HttpClient) {}

  private baseUrl: string =
    'https://localhost:7156/api/Prosumer/GetAllProsumers';
  private baseUrl3: string =
    'https://localhost:7156/api/Prosumer/UpdateProsumer';
  private baseUrl4: string =
    'https://localhost:7156/api/Prosumer/DeleteProsumer';
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
      'https://localhost:7156/api/Prosumer/GetProsumersByNeighborhoodId?id=' +
        id
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

  getUserProductionAndConsumption(id: string): Observable<any> {
    return this.http.get<any>(
      this.deviceBaseUrl + 'ConsumptionAndProductionByProsumer?id=' + id
    );
  }
  getDevicesByProsumerId(id: string): Observable<any> {
    return this.http.get<any>(
      'https://localhost:7156/GetAllDevicesForProsumer?id=' + id
    );
  }
  updateUserData(id: any, data: any) {
    return this.http.put(`${this.baseUrl3}` + `?id=` + id, data);
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.baseUrl4}` + `?id=` + id);
  }

  prosumerFilter(
    minCon: number,
    maxCon: number,
    minProd: number,
    maxProd: number,
    minDev: number,
    maxDev: number
  ): Observable<Prosumer[]> {
    return this.http.get<Prosumer[]>(
      'https://localhost:7156/ProsumerFilter?minConsumption=' +
        minCon +
        '&maxConsumption=' +
        maxCon +
        '&minProduction=' +
        minProd +
        '&maxProduction=' +
        maxProd +
        '&minDeviceCount=' +
        minDev +
        '&maxDeviceCount=' +
        maxDev
    );
  }
  prosumerFilter2(
    idNaselja: string,
    minCon: number,
    maxCon: number,
    minProd: number,
    maxProd: number,
    minDev: number,
    maxDev: number
  ): Observable<Prosumer[]> {
    return this.http.get<Prosumer[]>(
      'https://localhost:7156/ProsumerFilter2?neighbourhood=' +
        idNaselja +
        '&minConsumption=' +
        minCon +
        '&maxConsumption=' +
        maxCon +
        '&minProduction=' +
        minProd +
        '&maxProduction=' +
        maxProd +
        '&minDeviceCount=' +
        minDev +
        '&maxDeviceCount=' +
        maxDev
    );
  }
  HistoryProsumer7Days(id: string) {
    return this.http.get(
      `https://localhost:7156/LastWeeksConsumptionAndProduction?id=` + id
    );
  }
}
