import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimestampService {

  constructor(private http: HttpClient, private spiner: NgxSpinnerService) { }
  private timestampUrl: string = 'https://localhost:7156/api/Timestamp/';
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
}
