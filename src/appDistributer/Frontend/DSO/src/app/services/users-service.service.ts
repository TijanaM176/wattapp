import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prosumer } from '../models/userstable';
import { lastValueFrom } from 'rxjs';
import { Neighborhood } from '../models/neighborhood';
import { City } from '../models/city';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  consumtion!: string;
  production!: string;
  prosumers!: Prosumer[];

  constructor(private http: HttpClient, private spiner: NgxSpinnerService, private cookie : CookieService) {}

  private baseUrl: string = 'https://localhost:7156/api/Prosumer/';
  private updateUserUrl: string =
    'https://localhost:7156/api/Dso/UpdateProsumerByDso';
  private deviceBaseUrl: string = 'https://localhost:7156/api/Devices/';
  private dashboardBaseUrl: string = 'https://localhost:7156/api/DashboardData/';
  private dataUrl: string = 'https://localhost:7156/api/GenericData/';
  private timestampUrl: string = 'https://localhost:7156/api/Timestamp/';
  private totalUrl : string = 'https://localhost:7156/api/TotalPowerUsage/'

  refreshList() {
    lastValueFrom(this.http.get(this.baseUrl + 'GetAllProsumers')).then(
      (res) => (this.prosumers = res as Prosumer[])
    );
  }
  detailsEmployee(id: string) : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getProsumerByID` + `?id=` + id);
  }
  Page(page: number, pagesize: number) {
    return this.http.get(
      `${this.baseUrl}GetProsumersPaging?PageNumber=` +
        page +
        `&PageSize=` +
        pagesize
    );
  }

  getAllNeighborhoods(): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(this.dataUrl + 'GetAllNeighborhoods');
  }
  GetProsumersByNeighborhoodId(id: string): Observable<Prosumer[]> {
    return this.http.get<Prosumer[]>(
      this.baseUrl + 'GetProsumersByNeighborhoodId?id=' + id
    );
  }

  getAllProsumers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'GetAllProsumers');
  }
  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(this.dataUrl + 'GetCities');
  }
  getAllNeighborhoodByCityId(id: number): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(
      this.dataUrl + 'GetNeighborhoodsByCityId?id=' + id
    );
  }

  getCityNameById(id: number): Observable<string> {
    return this.http.get(this.dataUrl + 'GetCityNameById?id=' + id, {
      responseType: 'text',
    });
  }

  getUserProductionAndConsumption(id: string): Observable<any> {
    return this.http.get<any>(
      this.totalUrl + 'ConsumptionAndProductionByProsumer?id=' + id
    );
  }
  getDevicesByProsumerId(id: string): Observable<any> {
    return this.http.get<any>(
      this.deviceBaseUrl + 'GetAllDevicesForProsumer?id=' + id +'&role='+ this.cookie.get('role')
    );
  }
  // updateUserData(data: any) {
  //   return this.http.put(`${this.baseUrl3}`, data);
  updateUserData(id: any, data: any) {
    return this.http.put(`${this.updateUserUrl}` + `?id=` + id, data);
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.baseUrl}DeleteProsumer` + `?id=` + id);
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
      this.deviceBaseUrl +
        'UpdatedProsumerFilter?minConsumption=' +
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
      this.deviceBaseUrl +
        'UpdatedProsumerFilter2?neighborhood=' +
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
  HistoryProsumer7Days(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `LastWeeksConsumptionAndProduction?id=` + id
    );
  }
  HistoryProsumer1Month(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `LastMonthsConsumptionAndProduction?id=` + id
    );
  }
  HistoryProsumer1Year(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `LastYearsConsumptionAndProduction?id=` + id
    );
  }

  PredictionProsumer7Days(id : string): Observable<any>{
    return this.http.get(
      this.timestampUrl + `NextWeeksConsumptionAndProduction?id=` + id
    );
  }
  PredictionProsumer3Days(id : string): Observable<any>{
    return this.http.get(
      this.timestampUrl + `Next3DaysConsumptionAndProduction?id=` + id
    );
  }
  PredictionProsumer1Day(id : string): Observable<any>{
    return this.http.get(
      this.timestampUrl + `NextDaysConsumptionAndProduction?id=` + id
    );
  }

  HistoryAllProsumers7Days(): Observable<any> {
    return this.http.get(
      this.timestampUrl + 'LastWeeksConsumptionAndProductionTimestamps'
    );
  }

  HistoryAllProsumers1Month() {
    return this.http.get(
      this.timestampUrl + 'LastMonthsConsumptionAndProductionTimestamps'
    );
  }

  HistoryAllProsumers1Year() {
    return this.http.get(
      this.timestampUrl + 'LastYearsConsumptionAndProductionTimestamps'
    );
  }

  ProsumersInfo() {
    lastValueFrom(this.http.get(this.deviceBaseUrl + 'AllProsumerInfo')).then(
      (res) => {
        this.prosumers = res as Prosumer[];
        this.spiner.hide();
      },
      (err) => {
        // Handle any errors here
      }
    );
  }

  ProsumersInfo1(): Observable<any[]> {
    return this.http.get<any[]>(this.deviceBaseUrl + 'AllProsumerInfo');
  }

  Top5Consumers(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'Top5Consumers');
  }

  Top5Producers(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'Top5Producers');
  }

  ConsumerProducerRatio(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'ConsumerProducerRatio');
  }
  CityPercentages(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'CityPercentages');
  }

  ElectricityPrice(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'CurrentPrice');
  }

  PredictionNextWeek(): Observable<any> {
    return this.http.get(
      this.timestampUrl + `NextWeeksConsumptionAndProductionTimestamps`
    );
  }
  PredictionNext3Days(): Observable<any> {
    return this.http.get(
      this.timestampUrl + `Next3DaysConsumptionAndProductionTimestamps`
    );
  }
  PredictionNextDay(): Observable<any> {
    return this.http.get(
      this.timestampUrl + `NextDaysConsumptionAndProductionTimestamps`
    );
  }
}
