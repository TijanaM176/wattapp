import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceserviceService {

  constructor(private http:HttpClient) { }
  private baseUrl: string = 'https://localhost:7156/GetDevice';
  getInfoDevice(id:string){
    return this.http.get(`${this.baseUrl}` + `?id=` + id);
  }
}
