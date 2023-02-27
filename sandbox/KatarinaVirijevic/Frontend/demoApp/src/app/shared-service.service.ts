import { Injectable } from '@angular/core';

//import http cliend module and observable module

import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs'; //used to handle sync requests and responses

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  readonly APIUrl="http://localhost:5083/api";

  constructor(private http:HttpClient) { }

  getDepartmentList():Observable<any[]>
  {
    return this.http.get<any>(this.APIUrl+'/Departments');
  }

  getWorkersList():Observable<any[]>
  {
    return this.http.get<any>(this.APIUrl+'/Workers');
  }

  getWorker(val:any):Observable<any>
  {
    return this.http.get<any>(this.APIUrl+'/Workers/'+val);
  }

  addWorker(val:any)
  {
    return this.http.post(this.APIUrl+'/Workers',val);
  }

  updateWorker(val:any)
  {
    return this.http.put(this.APIUrl+'/Workers',val);
  }

  deleteWorker(val:any)
  {
    return this.http.delete(this.APIUrl+'/Workers/'+val);
  }
}
