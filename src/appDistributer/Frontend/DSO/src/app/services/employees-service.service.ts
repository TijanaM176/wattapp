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
  private baseUrlRegionRole: string="https://localhost:7156/api/Dso/";
  region: string = "";
  role!: number;
  employees!:Employee[];
  formData:Employee=new Employee();

  getAllData(){
    return this.http.get(this.baseUrl)
    .subscribe((res)=> this.employees = res as Employee[]);
    console.log(this.employees);
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
  /*
  refreshList(){
    lastValueFrom(this.http.get(this.baseUrl))
    .then(res=>this.employees = res as Employee[] )
  }
 */
  getAllRegions():Observable<any[]>
  {
    return this.http.get<any[]>(this.baseUrlRegionRole+"GetRegions");
  }

  getAllRoles(): Observable<any[]>
  {
    return this.http.get<any[]>(this.baseUrlRegionRole+"GetRoles");
  }

  filter()
  {
    if(this.role==0 && this.region=="")
    {
      this.getAllData();
    }
    else
    {
      this.getWorkersByFilter();
    }
  }

  getWorkersByFilter()
  {
    return this.http.get(this.baseUrlRegionRole+"GetWorkerByFilter?RegionID="+this.region+"&RoleID="+this.role)
    .subscribe({
      next:(res)=>{
        this.employees = res as Employee[]
      },
      error:(err)=>{
        this.employees = []
      }
    });
  }
}
