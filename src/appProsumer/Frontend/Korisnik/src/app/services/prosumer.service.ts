import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditDto } from '../models/editDto';

@Injectable({
  providedIn: 'root',
})
export class ProsumerService {
  baseUrl: string = 'https://localhost:7156/api/Prosumer/';
  cityId!:number;
  neighId!:string;
  constructor(private http: HttpClient) {}

  getInforamtion(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getProsumerByID?id=' + id);
  }

  editInfo(id: string, dto: EditDto) {
    return this.http.put(this.baseUrl + 'UpdateProsumer?id=' + id, dto);
  }

  getDevicesByProsumerId(id: string,role:string): Observable<any> {
    return this.http.get<any>(
      'https://localhost:7156/GetAllDevicesForProsumer?id=' + id+'&role='+role
    );
  }

  getDeviceById(id: string): Observable<any> {
    return this.http.get<any>('https://localhost:7156/GetDevice?id=' + id);
  }
  getCityById(): Observable<string> {
    return this.http.get(this.baseUrl + 'GetCityNameById?id=' + this.cityId,{responseType:'text'});
  }
  getNeighborhoodById(): Observable<string> {
    return this.http.get(this.baseUrl + 'GetNeighborhoodByName?id=' + this.neighId,{responseType:'text'});
  }
}
