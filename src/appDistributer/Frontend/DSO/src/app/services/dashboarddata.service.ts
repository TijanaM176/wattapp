import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DashboarddataService {
  constructor(private http: HttpClient, private spiner: NgxSpinnerService) {}
  private dashboardBaseUrl = environment.apiUrl;
  Top5Consumers(): Observable<any[]> {
    return this.http.get<any[]>(
      this.dashboardBaseUrl + 'DashboardData/Top5Consumers'
    );
  }

  Top5Producers(): Observable<any[]> {
    return this.http.get<any[]>(
      this.dashboardBaseUrl + 'DashboardData/Top5Producers'
    );
  }

  ConsumerProducerRatio(): Observable<any[]> {
    return this.http.get<any[]>(
      this.dashboardBaseUrl + 'DashboardData/ConsumerProducerRatio'
    );
  }
  CityPercentages(): Observable<any[]> {
    return this.http.get<any[]>(
      this.dashboardBaseUrl + 'DashboardData/CityPercentages'
    );
  }

  ElectricityPrice(): Observable<any[]> {
    return this.http.get<any[]>(
      this.dashboardBaseUrl + 'DashboardData/CurrentPrice'
    );
  }
  getProsumerCout(): Observable<any> {
    return this.http.get<any>(
      this.dashboardBaseUrl + 'DashboardData/ProsumerCount'
    );
  }

  TotalProd(): Observable<any> {
    return this.http.get(
      this.dashboardBaseUrl +
        'TotalPowerUsage/TodayAndYesterdayTotalProductionAndRatio'
    );
  }

  TotalCons(): Observable<any> {
    return this.http.get(
      this.dashboardBaseUrl +
        'TotalPowerUsage/TodayAndYesterdayTotalConsumptionAndRatio'
    );
  }

  nextWeekTotal(): Observable<any> {
    return this.http.get(
      this.dashboardBaseUrl +
        'TotalPowerUsage/TodayAndTomorrowPredictionTotalConsumptionAndRatio'
    );
  }
}
