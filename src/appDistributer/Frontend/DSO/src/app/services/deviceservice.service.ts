import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Prosumer } from '../models/userstable';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/enviroments/enviroment';
import { UserTableMapInitDto } from '../models/userTableMapInitDto';
import { Subject } from 'rxjs';

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

  maxCons: number = 0;
  maxProd: number = 0;
  maxDevCount: number = 0;
  minCons: number = 0;
  minProd: number = 0;
  minDevCount: number = 0;

  private responseGetAllProsumers = new Subject<UserTableMapInitDto>();
  public information$ = this.responseGetAllProsumers.asObservable();

  private initProsumersTable = new Subject<UserTableMapInitDto>();
  public initInfo$ = this.initProsumersTable.asObservable();

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

  //new range
  FilterRanges(cityId: string, neighId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Devices/FilterRanges?cityId=` +
        cityId +
        `&neighborhoodId=` +
        neighId
    );
  }

  prosumerFilter(
    minCon: number,
    maxCon: number,
    minProd: number,
    maxProd: number,
    minDev: number,
    maxDev: number,
    cityId: string,
    neighborhoodId: string
  ) {
    this.spiner.show();
    this.http
      .get(
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
          '&cityId=' +
          cityId +
          '&neighborhoodId=' +
          neighborhoodId
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.prosumers = res as Prosumer[];
          this.spiner.hide();
        },
        error: (err) => {
          this.prosumers = [];
          this.spiner.hide();
          console.log(err.error);
        },
      });
  }

  prosumerFilterMap(
    minCon: number,
    maxCon: number,
    minProd: number,
    maxProd: number,
    minDev: number,
    maxDev: number,
    cityId: string,
    neighborhoodId: string
  ): Observable<Prosumer[]> {
    this.spiner.show();
    return this.http.get<Prosumer[]>(
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
        '&cityId=' +
        cityId +
        '&neighborhoodId=' +
        neighborhoodId
    );
  }

  ProsumersInfo() {
    lastValueFrom(this.http.get(this.baseUrl + 'Devices/AllProsumerInfo')).then(
      (res) => {
        // console.log(res);
        let response = res as UserTableMapInitDto;
        this.prosumers = response.prosumers as Prosumer[];
        this.setFilters(response);
        this.initProsumersTable.next(response);
        this.spiner.hide();
      },
      (err) => {
        // Handle any errors here
      }
    );
  }

  private setFilters(response: any) {
    this.maxCons = Math.ceil(response.maxCons);
    this.minCons = Math.ceil(response.minCons);
    this.maxProd = Math.ceil(response.maxProd);
    this.minProd = Math.ceil(response.minProd);
    this.maxDevCount = response.maxDevCount;
    this.minDevCount = response.minDevCount;
  }

  ProsumersInfo1(): Observable<any> {
    return this.http.get(this.baseUrl + 'Devices/AllProsumerInfo');
  }

  toggleDevice(id: string, state: boolean): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + 'Devices/ToggleActivity?deviceId=' + id + '&role=Dso',
      { active: state }
    );
  }

  toggleStorageDevice(id: string, state: boolean, mode: number) {
    return this.http.put<any>(
      this.baseUrl +
        'Devices/ToggleStorageActivity?deviceId=' +
        id +
        '&role=' +
        localStorage.getItem('role')! +
        '&mode=' +
        mode,
      { active: state }
    );
  }
}
