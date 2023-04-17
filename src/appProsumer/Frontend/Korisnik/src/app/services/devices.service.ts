import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  baseUrl : string = 'https://localhost:7156/api/Timestamp/';
  totalUrl : string = 'https://localhost:7156/api/TotalPowerUsage/';

  constructor(private http : HttpClient, private cookie : CookieService) { }

  history7Days()
  {
    return this.http.get(this.baseUrl+'LastWeeksConsumptionAndProduction?id='+this.cookie.get('id'));
  }

  history1Month()
  {
    return this.http.get(this.baseUrl+'LastMonthsConsumptionAndProduction?id='+this.cookie.get('id'));
  }

  history1Year()
  {
    return this.http.get(this.baseUrl+'LastYearsConsumptionAndProduction?id='+this.cookie.get('id'));
  }

  prediction1Week()
  {
    return this.http.get(this.baseUrl+'NextWeeksConsumptionAndProduction?id='+this.cookie.get('id'));
  }

  prediction3Days()
  {
    return this.http.get(this.baseUrl+'Next3DaysConsumptionAndProduction?id='+this.cookie.get('id'));
  }

  prediction1Day()
  {
    return this.http.get(this.baseUrl+'NextDaysConsumptionAndProduction?id='+this.cookie.get('id'));
  }
  
  getCurrentConsumptionAndProduction( ): Observable<any>
  {
    return this.http.get<any>(this.totalUrl+'ConsumptionAndProductionByProsumer?id=' + this.cookie.get('id'));
  }
}
