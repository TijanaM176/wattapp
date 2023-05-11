import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../models/device';
import { EditDevice } from '../models/deviceedit';
import { environment } from 'src/enviroment/enviroment';
import { BatteryToggle } from '../models/batteryToggle';

@Injectable({
  providedIn: 'root',
})
export class DeviceserviceService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  model: any = 0;
  name: string = '';
  type: number = 0;
  getInfoDevice(id: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'Devices/GetDevice?id=' + id);
  }
  /*
  editInfo(id : string, deviceName:string, IpAddress:string, Manufacturer:string, DsoView:boolean,DsoControl:boolean):Observable<string>
  {
    return this.http.put(this.baseUrl1+'?IdDevice='+id+'&model='+Manufacturer+'&DeviceName='+deviceName+'&IpAddress='+IpAddress+'&dsoView='+DsoView+'&dsoControl='+DsoControl,{responseType:'text'});

  }*/
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

  toggleDevice(id: string, state: boolean): Observable<any> {
    return this.http.put<any>(
      this.baseUrl + 'Devices/ToggleActivity?deviceId=' + id + '&role=Prosumer',
      { active: state }
    );
  }

  toggleStorageDevice(id: string, state: boolean, mode : number)
  {
    return this.http.put<any>(this.baseUrl+'Devices/ToggleStorageActivity?deviceId='+id +'&role=Prosumer&mode='+mode, { active: state });
  }
}
