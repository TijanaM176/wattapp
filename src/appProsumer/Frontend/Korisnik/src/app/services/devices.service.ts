import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  baseUrl : string = 'https://localhost:7156/';

  constructor(private http : HttpClient, private cookie : CookieService) { }

  history7Days()
  {
    return this.http.get(this.baseUrl+'LastWeeksConsumptionAndProduction?id='+this.cookie.get('id'));
  }
  history7DaysTimestamps()
  {
    return this.http.get(this.baseUrl+'LastWeeksConsumptionAndProductionTimestamps');
  }


  history1Month()
  {
    return this.http.get(this.baseUrl+'LastMonthsConsumptionAndProduction?id='+this.cookie.get('id'));
  }
  history1MonthTimestamps()
  {
    return this.http.get(this.baseUrl+'LastMonthsConsumptionAndProductionTimestamps');
  }


  history1Year()
  {
    return this.http.get(this.baseUrl+'LastYearsConsumptionAndProduction?id='+this.cookie.get('id'));
  }
  history1YearTimestamps()
  {
    return this.http.get(this.baseUrl+'LastYearsConsumptionAndProductionTimestamps');
  }


  prediction1Week()
  {
    return this.http.get(this.baseUrl+'NextWeeksConsumptionAndProduction?id='+this.cookie.get('id'));
  }
  prediction1WeekTimestamps()
  {
    return this.http.get(this.baseUrl+'NextWeeksConsumptionAndProductionTimestamps');
  }
}
