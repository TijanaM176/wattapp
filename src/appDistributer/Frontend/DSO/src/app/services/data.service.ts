import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { City } from '../models/city';
import { Neighborhood } from '../models/neighborhood';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private spiner: NgxSpinnerService) {}
  private dataUrl = environment.apiUrl;
  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(this.dataUrl + 'GenericData/GetCities');
  }
  getAllNeighborhoodByCityId(id: number): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(
      this.dataUrl + 'GenericData/GetNeighborhoodsByCityId?id=' + id
    );
  }

  getCityNameById(id: number): Observable<string> {
    return this.http.get(
      this.dataUrl + 'GenericData/GetCityNameById?id=' + id,
      {
        responseType: 'text',
      }
    );
  }
  getAllRegions(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl + 'GenericData/GetRegions');
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl + 'GenericData/GetRoles');
  }
  getRoleName(id: number): Observable<string> {
    return this.http.get(
      `${this.dataUrl}GenericData/GetRoleName` + `?id=` + id,
      {
        responseType: 'text',
      }
    );
  }

  getRegionName(id: string): Observable<string> {
    return this.http.get(
      `${this.dataUrl}GenericData/GetRegionName` + `?id=` + id,
      {
        responseType: 'text',
      }
    );
  }
}
