import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employeestable';
import{lastValueFrom} from "rxjs";
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class EmployeesServiceService {
  update$: any;
  constructor(private http : HttpClient) { }
  private baseUrl: string = "https://localhost:7156/api/Dso/GetAllDsoWorkers";
  private baseUrl1: string = "https://localhost:7156/api/Dso/DeleteDsoWorker";
  private baseUrl2: string = "https://localhost:7156/api/Dso/GetDsoById";
  private baseUrlPage:string ="https://localhost:7156/api/Dso/GetDsoWorkerPaging";
  private basuUrlUpdate:string="https://localhost:7156/api/Dso/UpdateDsoWorker";
  private baseUrlRegion:string="https://localhost:7156/api/Dso/GetRegions";
  private baseUrlRole:string="https://localhost:7156/api/Dso/GetRoles";
  employees!:Employee[];
  formData:Employee=new Employee();

  getAllData(){
    return this.http.get(this.baseUrl);
  }
  updateEmployee(id:string,formUpdate:any){
    return this.http.put(`${this.basuUrlUpdate}`+`?id=`+id,formUpdate);
  }
  
  deleteEmployee(id:string)/*:Observable<Employee>*/
  {
    return this.http.delete(`${this.baseUrl1}`+`?id=`+id);
    //return this.http.delete<Employee>(this.baseUrl + "DeleteDsoWorker" + id);
  }
  detailsEmployee(id:string){
    
    return this.http.get(`${this.baseUrl2}`+`?id=`+id);
    
  }
  Page(page:number,pagesize:number){
    return this.http.get(`${this.baseUrlPage}?PageNumber=`+page+`&PageSize=`+pagesize);
  }
  getAllRegions(){
    return this.http.get(`${this.baseUrlRegion}`);
  }
  getAllRoles(){
    return this.http.get(`${this.baseUrlRole}`);
  }
  /*
  refreshList(){
    lastValueFrom(this.http.get(this.baseUrl))
    .then(res=>this.employees = res as Employee[] )
  }
 */

}
