import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseUrl : string = 'https://localhost:7156/api/DashboardData/';

  constructor(private http : HttpClient, private cookie : CookieService) { }

  getCurrentElecticityPrice() : Observable<any>
  {
    return this.http.get<any>(this.baseUrl+'CurrentPrice')
  }
}
