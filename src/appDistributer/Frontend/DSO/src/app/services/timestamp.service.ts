import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimestampService {
  constructor(private http: HttpClient, private cookie: CookieService) {}
  private timestampUrl: string = 'https://localhost:7156/api/';
  HistoryProsumer7Days(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `Timestamp/LastWeeksConsumptionAndProduction?id=` + id
    );
  }

  HistoryAllProsumers7Days(): Observable<any> {
    return this.http.get(
      this.timestampUrl +
        'Timestamp/LastWeeksConsumptionAndProductionTimestamps'
    );
  }

  HistoryAllProsumers1Month() {
    return this.http.get(
      this.timestampUrl +
        'Timestamp/LastMonthsConsumptionAndProductionTimestamps'
    );
  }
  HistoryAllProsumers1Year() {
    return this.http.get(
      this.timestampUrl +
        'Timestamp/LastYearsConsumptionAndProductionTimestamps'
    );
  }
  PredictionNextWeek(): Observable<any> {
    return this.http.get(
      this.timestampUrl +
        `Timestamp/NextWeeksConsumptionAndProductionTimestamps`
    );
  }
  PredictionNext3Days(): Observable<any> {
    return this.http.get(
      this.timestampUrl +
        `Timestamp/Next3DaysConsumptionAndProductionTimestamps`
    );
  }
  PredictionNextDay(): Observable<any> {
    return this.http.get(
      this.timestampUrl + `Timestamp/NextDaysConsumptionAndProductionTimestamps`
    );
  }

  PredictionProsumer7Days(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `Timestamp/NextWeeksConsumptionAndProduction?id=` + id
    );
  }
  PredictionProsumer3Days(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `Timestamp/Next3DaysConsumptionAndProduction?id=` + id
    );
  }
  PredictionProsumer1Day(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `Timestamp/NextDaysConsumptionAndProduction?id=` + id
    );
  }
  HistoryProsumer1Month(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl +
        `Timestamp/LastMonthsConsumptionAndProduction?id=` +
        id
    );
  }
  HistoryProsumer1Year(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + `Timestamp/LastYearsConsumptionAndProduction?id=` + id
    );
  }
  predictionDevice(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl + 'Timestamp/PredictionForDevice?idDevice=' + id
    );
  }
  historyDeviceWeek(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl +
        `Timestamp/ProductionConsumptionForLastWeekForDevice?idDevice=` +
        id
    );
  }
  historyDeviceMonth(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl +
        `Timestamp/ProductionConsumptionForLastMonthForDevice?idDevice=` +
        id
    );
  }
  historyDeviceYear(id: string): Observable<any> {
    return this.http.get(
      this.timestampUrl +
        `Timestamp/ProductionConsumptionForLastYearForDevice?idDevice=` +
        id
    );
  }
  history7Days() {
    return this.http.get(
      this.timestampUrl +
        'Timestamp/LastWeeksConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }
}
