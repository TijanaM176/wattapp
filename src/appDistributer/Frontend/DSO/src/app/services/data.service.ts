import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { City } from '../models/city';
import { Neighborhood } from '../models/neighborhood';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private spiner: NgxSpinnerService) { }
  private dataUrl: string = 'https://localhost:7156/api/GenericData/';
  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(this.dataUrl + 'GetCities');
  }
  getAllNeighborhoodByCityId(id: number): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(
      this.dataUrl + 'GetNeighborhoodsByCityId?id=' + id
    );
  }

  getCityNameById(id: number): Observable<string> {
    return this.http.get(this.dataUrl + 'GetCityNameById?id=' + id, {
      responseType: 'text',
    });
  }
  getAllRegions(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl + 'GetRegions');
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl + 'GetRoles');
  }
  getRoleName(id: number): Observable<string> {
    return this.http.get(`${this.dataUrl}GetRoleName` + `?id=` + id, {
      responseType: 'text',
    });
  }

  getRegionName(id: string): Observable<string> {
    return this.http.get(`${this.dataUrl}GetRegionName` + `?id=` + id, {
      responseType: 'text',
    });
  }
}