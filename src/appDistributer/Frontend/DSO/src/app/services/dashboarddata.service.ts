import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboarddataService {
  constructor(private http: HttpClient, private spiner: NgxSpinnerService) {}
  private dashboardBaseUrl: string =
    'https://localhost:7156/api/DashboardData/';
  private totalUrl: string = 'https://localhost:7156/api/TotalPowerUsage/';
  Top5Consumers(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'Top5Consumers');
  }

  Top5Producers(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'Top5Producers');
  }

  ConsumerProducerRatio(): Observable<any[]> {
    return this.http.get<any[]>(
      this.dashboardBaseUrl + 'ConsumerProducerRatio'
    );
  }
  CityPercentages(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'CityPercentages');
  }

  ElectricityPrice(): Observable<any[]> {
    return this.http.get<any[]>(this.dashboardBaseUrl + 'CurrentPrice');
  }
  getProsumerCout(): Observable<any> {
    return this.http.get<any>(
      'https://localhost:7156/api/DashboardData/ProsumerCount'
    );
  }

  TotalProd(): Observable<any> {
    return this.http.get(
      this.totalUrl + 'TodayAndYesterdayTotalProductionAndRatio'
    );
  }

  TotalCons(): Observable<any> {
    return this.http.get(
      this.totalUrl + 'TodayAndYesterdayTotalConsumptionAndRatio'
    );
  }

  nextWeekTotal(): Observable<any> {
    return this.http.get(
      this.totalUrl + 'TodayAndTomorrowPredictionTotalConsumptionAndRatio'
    );
  }
}
