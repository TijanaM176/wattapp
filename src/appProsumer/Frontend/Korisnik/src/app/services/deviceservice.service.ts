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
  private baseUrl: string = 'https://localhost:7156/api/Devices/GetDevice';
  private baseUrl1: string = 'https://localhost:7156/api/Devices/EditDevice';
  private baseUrl2: string = 'https://localhost:7156/api/Devices/DeleteDevice';
  private baseUrl3: string = 'https://localhost:7156/api/GenericData/GetModels';
  private baseUrl4: string =
    'https://localhost:7156/api/Devices/ToggleActivity';
  model: any = 0;
  name: string = '';
  type: number = 0;
  getInfoDevice(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + '?id=' + id);
  }
  /*
  editInfo(id : string, deviceName:string, IpAddress:string, Manufacturer:string, DsoView:boolean,DsoControl:boolean):Observable<string>
  {
    return this.http.put(this.baseUrl1+'?IdDevice='+id+'&model='+Manufacturer+'&DeviceName='+deviceName+'&IpAddress='+IpAddress+'&dsoView='+DsoView+'&dsoControl='+DsoControl,{responseType:'text'});

  }*/
  editInfo(id: string, dto: EditDevice): Observable<string> {
    return this.http.put(
      this.baseUrl1 +
        '?IdDevice=' +
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
    return this.http.get<any>(this.baseUrl3 + '?typeId=' + this.type);
  }
  deleteDevice(id: string): Observable<string> {
    return this.http.delete(this.baseUrl2 + '?IdDevice=' + id, {
      responseType: 'text',
    });
  }

  toggleDevice(id: string, state: boolean): Observable<any> {
    return this.http.put<any>(
      this.baseUrl4 + '?deviceId=' + id + '&role=Prosumer',
      { active: state }
    );
  }
}
