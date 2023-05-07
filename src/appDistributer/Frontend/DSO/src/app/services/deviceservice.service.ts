import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Prosumer } from '../models/userstable';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DeviceserviceService {
  constructor(
    private http: HttpClient,
    private spiner: NgxSpinnerService,
    private cookie: CookieService
  ) {}

  private baseUrl = environment.apiUrl;
  prosumers!: Prosumer[];
  numofdevices!: number;

  getInfoDevice(id: string) {
    return this.http.get(`${this.baseUrl}Devices/GetDevice` + `?id=` + id);
  }
  getCurrConsumptionAndProduction(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'DashboardData/DsoSidebarInfo');
  }
  getUserProductionAndConsumption(id: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl +
        'TotalPowerUsage/ConsumptionAndProductionByProsumer?id=' +
        id
    );
  }

  getDevicesByProsumerId(id: string): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + 'Devices/GetAllDevicesForProsumer?id=' + id + '&role=Dso'
    );
  }
  
  prosumerFilter(
    minCon: number,
    maxCon: number,
    minProd: number,
    maxProd: number,
    minDev: number,
    maxDev: number,
    cityId : string,
    neighborhoodId : string
  ) {
    this.spiner.show();
    this.http.get(
      this.baseUrl +
        'Devices/UpdatedProsumerFilter?minConsumption=' +
        minCon +
        '&maxConsumption=' +
        maxCon +
        '&minProduction=' +
        minProd +
        '&maxProduction=' +
        maxProd +
        '&minDeviceCount=' +
        minDev +
        '&maxDeviceCount=' +
        maxDev +
        '&cityId=' + cityId+
        '&neighborhoodId=' + neighborhoodId
    ).subscribe({
      next:(res)=>{
        this.spiner.hide();
        this.prosumers = res as Prosumer[];
      },
      error:(err)=>{
        this.prosumers = [];
        this.spiner.hide();
        console.log(err.error);
      }
    })
  }
  ProsumersInfo() {
    lastValueFrom(this.http.get(this.baseUrl + 'Devices/AllProsumerInfo')).then(
      (res) => {
        this.prosumers = res as Prosumer[];
        this.spiner.hide();
      },
      (err) => {
        // Handle any errors here
      }
    );
  }

  ProsumersInfo1(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'Devices/AllProsumerInfo');
  }

  toggleDevice(id: string, state: boolean): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + 'Devices/ToggleActivity?deviceId=' + id + '&role=Dso',
      { active: state }
    );
  }
}
