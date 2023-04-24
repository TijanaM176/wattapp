import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../models/device';
import { EditDevice } from '../models/deviceedit';

@Injectable({
  providedIn: 'root',
})
export class DeviceserviceService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = 'https://localhost:7156/api/';
  model: any = 0;
  name: string = '';
  type: number = 0;

  getInfoDevice(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'Devices/GetDevice?id=' + id);
  }

  editInfo(id: string, dto: EditDevice): Observable<string> {
    return this.http.put(
      this.baseUrl +
        'Devices/EditDevice?IdDevice=' +
        id +
        '&model=' +
        dto.ModelId +
        '&DeviceName=' +
        dto.Name +
        '&IpAddress=' +
        dto.IpAddress +
        '&dsoView=' +
        dto.DsoView +
        '&dsoControl=' +
        dto.DsoControl,
      dto,
      { responseType: 'text' }
    );
  }
  getModel(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + 'GenericData/GetModels?typeId=' + this.type
    );
  }
  deleteDevice(id: string): Observable<string> {
    return this.http.delete(
      this.baseUrl + 'Devices/DeleteDevice?IdDevice=' + id,
      {
        responseType: 'text',
      }
    );
  }
}
