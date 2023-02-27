import { Injectable } from '@angular/core';

//import http cliend module and observable module

import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs'; //used to handle sync requests and responses
import { IWorker } from './models/worker.model';
import { IDepartment } from './models/department.model';
import { INewWorker } from './models/newWorker.model';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  readonly APIUrl="http://localhost:5083/api";

  constructor(private http:HttpClient) { }

  getDepartmentList():Observable<IDepartment[]>
  {
    return this.http.get<IDepartment[]>(this.APIUrl+'/Departments');
  }

  getWorkersList():Observable<IWorker[]>
  {
    return this.http.get<IWorker[]>(this.APIUrl+'/Workers');
  }

  getWorker(val:any):Observable<IWorker>
  {
    return this.http.get<IWorker>(this.APIUrl+'/Workers/'+val);
  }

  addWorker(val:INewWorker)
  {
    return this.http.post(this.APIUrl+'/Workers',val);
  }

  updateWorker(id:any,val:INewWorker)
  {
    return this.http.put(this.APIUrl+'/Workers/'+id,val);
  }

  deleteWorker(id:any)
  {
    return this.http.delete(this.APIUrl+'/Workers/'+id);
  }
}
