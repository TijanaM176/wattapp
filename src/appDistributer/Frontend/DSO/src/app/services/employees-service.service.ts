import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employeestable';
import{lastValueFrom} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class EmployeesServiceService {
  constructor(private http : HttpClient) { }
  private baseUrl: string = "https://localhost:7156/api/Dso/GetAllDsoWorkers";
  private baseUrl1: string = "https://localhost:7156/api/Dso/DeleteDsoWorkers";
  private baseUrl2: string = "https://localhost:7156/api/Dso/GetDsoById";
  
  employees!:Employee[];
  formData:Employee=new Employee();
  getAllData(){
    return this.http.get(this.baseUrl);
  }
  
  deleteEmployee(id:string)/*:Observable<Employee>*/
  {
    return this.http.delete(this.baseUrl1+'/'+id);
    //return this.http.delete<Employee>(this.baseUrl + "DeleteDsoWorker" + id);
  }
  detailsEmployee(id:string){
    return this.http.get(this.baseUrl2);
  }
  /*
  refreshList(){
    lastValueFrom(this.http.get(this.baseUrl))
    .then(res=>this.employees = res as Employee[] )
  }
 */

}
