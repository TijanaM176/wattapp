import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookie: CookieService) {}

  history7Days() {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.get(
      this.baseUrl +
        'Timestamp/LastWeeksConsumptionAndProduction?id=' + id
    );
  }

  history1Month() {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.get(
      this.baseUrl +
        'Timestamp/LastMonthsConsumptionAndProduction?id=' + id
    );
  }

  history1Year() {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.get(
      this.baseUrl +
        'Timestamp/LastYearsConsumptionAndProduction?id=' + id
    );
  }

  prediction1Week() {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.get(
      this.baseUrl +
        'Timestamp/NextWeeksConsumptionAndProduction?id=' + id
    );
  }

  prediction3Days() {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.get(
      this.baseUrl +
        'Timestamp/Next3DaysConsumptionAndProduction?id=' + id
    );
  }

  prediction1Day() {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.get(
      this.baseUrl +
        'Timestamp/NextDaysConsumptionAndProduction?id=' + id
    );
  }

  getCurrentConsumptionAndProduction(): Observable<any> {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.get<any>(
      this.baseUrl +
        'TotalPowerUsage/ConsumptionAndProductionByProsumer?id=' + id
    );
  }

  getConsumptionAndProductionLimit(): Observable<any> {
    let id = localStorage.getItem('idProsumer')!;
    return this.http.get<any>(
      this.baseUrl +
        'TotalPowerUsage/ThisMonthTotalConsumptionProductionForProsumer?prosumerId=' + id
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
        `Timestamp/ProductionConsumptionForLastWeekForDevice?idDevice=` +
        id
    );
  }
  historyDeviceMonth(id: string): Observable<any> {
    return this.http.get(
      this.baseUrl +
        `Timestamp/ProductionConsumptionForLastMonthForDevice?idDevice=` +
        id
    );
  }
  historyDeviceYear(id: string): Observable<any> {
    return this.http.get(
      this.baseUrl +
        `Timestamp/ProductionConsumptionForLastYearForDevice?idDevice=` +
        id
    );
  }
}
