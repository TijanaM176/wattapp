import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Prosumer } from '../models/userstable';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class DeviceserviceService {
  constructor(private http: HttpClient, private spiner: NgxSpinnerService) {}

  private baseUrl: string = 'https://localhost:7156/api/';
  private deviceBaseUrl: string = 'https://localhost:7156/api/Devices/';
  private totalUrl: string = 'https://localhost:7156/api/TotalPowerUsage/';
  prosumers!: Prosumer[];

  getInfoDevice(id: string) {
    return this.http.get(`${this.deviceBaseUrl}GetDevice` + `?id=` + id);
  }
  getCurrConsumptionAndProduction(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'DashboardData/DsoSidebarInfo');
  }
  getUserProductionAndConsumption(id: string): Observable<any> {
    return this.http.get<any>(
      this.totalUrl + 'ConsumptionAndProductionByProsumer?id=' + id
    );
  }

  getDevicesByProsumerId(id: string): Observable<any> {
    return this.http.get<any>(
      this.deviceBaseUrl + 'GetAllDevicesForProsumer?id=' + id + '&role=dso'
    );
  }
  prosumerFilter(
    minCon: number,
    maxCon: number,
    minProd: number,
    maxProd: number,
    minDev: number,
    maxDev: number
  ): Observable<Prosumer[]> {
    return this.http.get<Prosumer[]>(
      this.deviceBaseUrl +
        'UpdatedProsumerFilter?minConsumption=' +
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
        maxDev
    );
  }
  prosumerFilter2(
    idNaselja: string,
    minCon: number,
    maxCon: number,
    minProd: number,
    maxProd: number,
    minDev: number,
    maxDev: number
  ): Observable<Prosumer[]> {
    return this.http.get<Prosumer[]>(
      this.deviceBaseUrl +
        'UpdatedProsumerFilter2?neighborhood=' +
        idNaselja +
        '&minConsumption=' +
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
        maxDev
    );
  }
  ProsumersInfo() {
    lastValueFrom(this.http.get(this.deviceBaseUrl + 'AllProsumerInfo')).then(
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
    return this.http.get<any[]>(this.deviceBaseUrl + 'AllProsumerInfo');
  }
}
