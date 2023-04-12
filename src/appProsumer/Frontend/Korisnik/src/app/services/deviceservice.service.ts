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
  private baseUrl3:string='https://localhost:7156/GetModels';
  model:any=0;
  name:string='';
  type:number=0;
  getInfoDevice(id : string):Observable<any>
  {
    return this.http.get<any>(this.baseUrl+'?id='+id);
  }
  /*
  editInfo(id : string, deviceName:string, IpAddress:string, Manufacturer:string, DsoView:boolean,DsoControl:boolean):Observable<string>
  {
    return this.http.put(this.baseUrl1+'?IdDevice='+id+'&model='+Manufacturer+'&DeviceName='+deviceName+'&IpAddress='+IpAddress+'&dsoView='+DsoView+'&dsoControl='+DsoControl,{responseType:'text'});

  }*/
  editInfo(id: string, dto: EditDevice):Observable<string> {
    return this.http.put(this.baseUrl1 + '?IdDevice=' + id+'&model='+dto.ModelId+'&DeviceName='+dto.Name+'&IpAddress='+dto.IpAddress+'&dsoView='+dto.DsoView+'&dsoControl='+dto.DsoControl, dto, {responseType:'text'});
  }
  getModel():Observable<any>{
    return this.http.get<any>(this.baseUrl3+'?typeId='+this.type);
  }
  deleteDevice(id:string):Observable<string>{
    return this.http.delete(this.baseUrl2+'?IdDevice='+id,{responseType:'text'});
  }
  
 
}
