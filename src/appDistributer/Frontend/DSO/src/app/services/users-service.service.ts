import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prosumer } from '../models/userstable';
import { lastValueFrom } from 'rxjs';
import { Neighborhood } from '../models/neighborhood';
import { City } from '../models/city';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  consumtion!: string;
  production!: string;
  prosumers!: Prosumer[];

  constructor(private http: HttpClient, private spiner: NgxSpinnerService) {}

  private baseUrl: string = 'https://localhost:7156/api/Prosumer/';
  private updateUserUrl: string =
    'https://localhost:7156/api/Dso/UpdateProsumerByDso';
  private deviceBaseUrl: string = 'https://localhost:7156/api/Devices/';
  private dashboardBaseUrl: string = 'https://localhost:7156/api/DashboardData/';
  private dataUrl: string = 'https://localhost:7156/api/GenericData/';
  private timestampUrl: string = 'https://localhost:7156/api/Timestamp/';

  refreshList() {
    lastValueFrom(this.http.get(this.baseUrl + 'GetAllProsumers')).then(
      (res) => (this.prosumers = res as Prosumer[])
    );
  }
  detailsEmployee(id: string) : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}getProsumerByID` + `?id=` + id);
  }
  Page(page: number, pagesize: number) {
    return this.http.get(
      `${this.baseUrl}GetProsumersPaging?PageNumber=` +
        page +
        `&PageSize=` +
        pagesize
    );
  }

  getAllNeighborhoods(): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(this.dataUrl + 'GetAllNeighborhoods');
  }
  GetProsumersByNeighborhoodId(id: string): Observable<Prosumer[]> {
    return this.http.get<Prosumer[]>(
      this.baseUrl + 'GetProsumersByNeighborhoodId?id=' + id
    );
  }

  getAllProsumers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'GetAllProsumers');
  }
  

  
  // updateUserData(data: any) {
  //   return this.http.put(`${this.baseUrl3}`, data);
  updateUserData(id: any, data: any) {
    return this.http.put(`${this.updateUserUrl}` + `?id=` + id, data);
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.baseUrl}DeleteProsumer` + `?id=` + id);
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
