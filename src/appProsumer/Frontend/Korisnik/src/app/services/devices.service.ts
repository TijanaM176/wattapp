import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private baseUrl = enviroment.apiUrl;

  constructor(private http: HttpClient, private cookie: CookieService) {}

  history7Days() {
    return this.http.get(
      this.baseUrl +
        'Timestamp/LastWeeksConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }

  history1Month() {
    return this.http.get(
      this.baseUrl +
        'Timestamp/LastMonthsConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }

  history1Year() {
    return this.http.get(
      this.baseUrl +
        'Timestamp/LastYearsConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }

  prediction1Week() {
    return this.http.get(
      this.baseUrl +
        'Timestamp/NextWeeksConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }

  prediction3Days() {
    return this.http.get(
      this.baseUrl +
        'Timestamp/Next3DaysConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }

  prediction1Day() {
    return this.http.get(
      this.baseUrl +
        'Timestamp/NextDaysConsumptionAndProduction?id=' +
        this.cookie.get('id')
    );
  }

  getCurrentConsumptionAndProduction(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl +
        'TotalPowerUsage/ConsumptionAndProductionByProsumer?id=' +
        this.cookie.get('id')
    );
  }

  getConsumptionAndProductionLimit(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl +
        'TotalPowerUsage/ThisMonthTotalConsumptionProductionForProsumer?prosumerId=' +
        this.cookie.get('id')
    );
  }
  predictionDevice(id: string): Observable<any> {
    return this.http.get(
      this.baseUrl + 'Timestamp/PredictionForDevice?idDevice=' + id
    );
  }

  historyDeviceWeek(id: string): Observable<any> {
    return this.http.get(
      this.baseUrl +
        'Timestamp/ProductionConsumptionForLastWeekForDevice?idDevice=' +
        id
    );
  }
  historyDeviceMonth(id: string): Observable<any> {
    return this.http.get(
      this.baseUrl +
        'Timestamp/ProductionConsumptionForLastMonthForDevice?idDevice=' +
        id
    );
  }
  historyDeviceYear(id: string): Observable<any> {
    return this.http.get(
      this.baseUrl +
        'Timestamp/ProductionConsumptionForLastYearForDevice?idDevice=' +
        id
    );
  }
}
