import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../models/device';
import { EditDevice } from '../models/deviceedit';

@Injectable({
  providedIn: 'root'
})
export class DeviceserviceService {

  constructor(private http:HttpClient) { }
  private baseUrl: string = 'https://localhost:7156/GetDevice';
  private baseUrl1: string = 'https://localhost:7156/EditDevice';
  private baseUrl2:string='https://localhost:7156/DeleteDevice';
  getInfoDevice(id : string):Observable<any>
  {
    return this.http.get<any>(this.baseUrl+'?id='+id);
  }
  editInfo(id : string, deviceName:string, IpAddress:string)
  {
    return this.http.put(this.baseUrl1+'?IdDevice='+id+'&DeviceName='+deviceName+'&IpAddress='+IpAddress,{});
  }
  deleteDevice(id:string):Observable<string>{
    return this.http.delete(this.baseUrl2+'?IdDevice='+id,{responseType:'text'});
  }

 
}
