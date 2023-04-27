import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddDevice } from '../models/adddevice';
import { environment } from 'src/enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AdddeviceserviceService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  category!: number;
  type!: number;
  model!: string;
  name!: string;
  dsoView!: boolean;
  dsoControl!: boolean;
  id!: string;
  getCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'GenericData/GetCategories');
  }
  getTypes(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl +
        'GenericData/GetTypesByCategory?categoryId=' +
        this.category
    );
  }
  getModels(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + 'GenericData/GetModels?typeId=' + this.type
    );
  }
  RegisterDevice(dto: AddDevice): Observable<string> {
    return this.http.post(
      this.baseUrl +
        'Devices/RegisterDevice?prosumerId=' +
        this.id +
        '&modelId=' +
        dto.modelId +
        '&name=' +
        dto.name +
        '&dsoView=' +
        dto.dsoView +
        '&dsoControl=' +
        dto.dsoControl,
      {},
      { responseType: 'text' }
    );
  }
}
