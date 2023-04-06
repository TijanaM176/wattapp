import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdddeviceserviceService {

  constructor(private http:HttpClient) { }
  private baseUrl: string = 'https://localhost:7156/GetCategories';
  private baseUrl1:string='https://localhost:7156/GetTypesByCategory';
  private baseUrl2:string='https://localhost:7156/GetModels';
  private baseUrl3:string='https://localhost:7156/RegisterDevice';
  category!:number;
  type!:number;
  model!:string;
  name!:string;
  id!:string;
  getCategories():Observable<any>{
    return this.http.get<any>(this.baseUrl);
  }
  getTypes():Observable<any>{
    return this.http.get<any>(this.baseUrl1+'?categoryId='+this.category);
  }
  getModels():Observable<any>{
    return this.http.get<any>(this.baseUrl2+'?typeId='+this.type);
  }
  RegisterDevice():Observable<string>{
    return this.http.get(this.baseUrl3+'?prosumerId='+this.id+'&modelId='+this.model+'&name='+this.name,{responseType:'text'});
  }
}
