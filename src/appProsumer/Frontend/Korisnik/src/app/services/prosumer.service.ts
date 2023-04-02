import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditDto } from '../models/editDto';

@Injectable({
  providedIn: 'root'
})
export class ProsumerService {

  baseUrl : string = 'https://localhost:7156/api/Prosumer/';

  constructor(private http:HttpClient) { }

  getInforamtion(id : string):Observable<any>
  {
    return this.http.get<any>(this.baseUrl+'getProsumerByID?id='+id);
  }

  editInfo(id : string, dto : EditDto)
  {
    this.http.put(this.baseUrl+'UpdateProsumer?id='+id,dto);
  }
}
