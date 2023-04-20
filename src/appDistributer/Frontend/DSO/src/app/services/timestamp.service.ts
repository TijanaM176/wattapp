import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimestampService {
  constructor(private http: HttpClient, private spiner: NgxSpinnerService,private cookie: CookieService) {}
  private timestampUrl: string = 'https://localhost:7156/api/Timestamp/';
  private totalUrl: string = 'https://localhost:7156/api/TotalPowerUsage/';
  HistoryProsumer7Days(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `LastWeeksConsumptionAndProduction?id=` + id
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

  PredictionProsumer7Days(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `NextWeeksConsumptionAndProduction?id=` + id
    );
  }
  PredictionProsumer3Days(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `Next3DaysConsumptionAndProduction?id=` + id
    );
  }
  PredictionProsumer1Day(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `NextDaysConsumptionAndProduction?id=` + id
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
  predictionDevice(id: string): Observable<any> {
    return this.http.get(this.timestampUrl + 'PredictionForDevice?idDevice=' + id);
  }
  historyDeviceWeek(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `ProductionConsumptionForLastWeekForDevice?idDevice=` + id
    );
  }
  historyDeviceMonth(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `ProductionConsumptionForLastMonthForDevice?idDevice=` + id
    );
  }
  historyDeviceYear(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `ProductionConsumptionForLastYearForDevice?idDevice=` + id
    );
  }
  history7Days() {
    return this.http.get(
      this.timestampUrl +
        'LastWeeksConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }
}