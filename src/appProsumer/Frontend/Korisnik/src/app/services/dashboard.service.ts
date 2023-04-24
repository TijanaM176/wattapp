import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = enviroment.apiUrl;

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getCurrentElecticityPrice(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'DashboardData/CurrentPrice');
  }
}
