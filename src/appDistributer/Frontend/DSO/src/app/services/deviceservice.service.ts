import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceserviceService {

  constructor(private http:HttpClient) { }

  private baseUrl: string = 'https://localhost:7156/api/';

  getInfoDevice(id:string){
    return this.http.get(`${this.baseUrl}Device/GetDevice` + `?id=` + id);
  }
  getCurrConsumptionAndProduction():Observable<any>
  {
    return this.http.get<any>(this.baseUrl+'DashboardData/DsoSidebarInfo');
  }
}
