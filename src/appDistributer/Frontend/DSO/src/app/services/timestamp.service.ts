import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class TimestampService {
  constructor(private http: HttpClient, private cookie: CookieService) {}
  private timestampUrl = enviroment.apiUrl;
  HistoryProsumer7Days(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/LastWeeksConsumptionAndProduction?id=' +
        id
    );
  }

  HistoryAllProsumers7Days(): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/LastWeeksConsumptionAndProductionTimestamps'
    );
  }

  HistoryAllProsumers1Month(): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/LastMonthsConsumptionAndProductionTimestamps'
    );
  }
  HistoryAllProsumers1Year(): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/LastYearsConsumptionAndProductionTimestamps'
    );
  }
  PredictionNextWeek(): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/NextWeeksConsumptionAndProductionTimestamps'
    );
  }
  PredictionNext3Days(): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/Next3DaysConsumptionAndProductionTimestamps'
    );
  }
  PredictionNextDay(): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/NextDaysConsumptionAndProductionTimestamps'
    );
  }

  PredictionProsumer7Days(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/NextWeeksConsumptionAndProduction?id=' +
        id
    );
  }
  PredictionProsumer3Days(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/Next3DaysConsumptionAndProduction?id=' +
        id
    );
  }
  PredictionProsumer1Day(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/NextDaysConsumptionAndProduction?id=' +
        id
    );
  }
  HistoryProsumer1Month(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/LastMonthsConsumptionAndProduction?id=' +
        id
    );
  }
  HistoryProsumer1Year(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/LastYearsConsumptionAndProduction?id=' +
        id
    );
  }
  predictionDevice(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/PredictionForDevice?idDevice=' +
        id
    );
  }
  historyDeviceWeek(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/ProductionConsumptionForLastWeekForDevice?idDevice=' +
        id
    );
  }
  historyDeviceMonth(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/ProductionConsumptionForLastMonthForDevice?idDevice=' +
        id
    );
  }
  historyDeviceYear(id: string): Observable<any> {
    return this.http.get(
      'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/ProductionConsumptionForLastYearForDevice?idDevice=' +
        id
    );
  }
  history7Days(): Observable<any> {
    return this.http.get(
      this.timestampUrl +
        'http://softeng.pmf.kg.ac.rs:10071/api/Timestamp/LastWeeksConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }
}
