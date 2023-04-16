import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employeestable';
import { lastValueFrom } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EmployeesServiceService {

  update$: any;

  region: string = '';
  role!: number;
  employees!: Employee[];
  formData: Employee = new Employee();

  constructor(private http: HttpClient) {}

  private baseUrl: string = 'https://localhost:7156/api/Dso/';
  private dataUrl: string = 'https://localhost:7156/api/GenericData/';


  getAllData() {
    return this.http
      .get(this.baseUrl+'GetAllDsoWorkers')
      .subscribe((res) => (this.employees = res as Employee[]));
  }

  updateEmployee(id: string, formUpdate: any) {
    return this.http.put(`${this.baseUrl}UpdateDsoWorker` + `?id=` + id, formUpdate);
  }

  deleteEmployee(id: string) {
    return this.http.delete(`${this.baseUrl}DeleteDsoWorker` + `?id=` + id);
  }

  detailsEmployee(id: string):Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetDsoById` + `?id=` + id);
  }

  Page(page: number, pagesize: number) {
    return this.http.get(
      `${this.baseUrl}GetDsoWorkerPaging?PageNumber=` + page + `&PageSize=` + pagesize
    );
  }

  getRoleName(id: number): Observable<string> {
    return this.http.get(`${this.dataUrl}GetRoleName` + `?id=` + id, {
      responseType: 'text',
    });
  }

  getRegionName(id: string): Observable<string> {
    return this.http.get(`${this.dataUrl}GetRegionName` + `?id=` + id, {
      responseType: 'text',
    });
  }
  /*
  refreshList(){
    lastValueFrom(this.http.get(this.baseUrl))
    .then(res=>this.employees = res as Employee[] )
  }
 */
  getAllRegions(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl + 'GetRegions');
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl + 'GetRoles');
  }

  filter() {
    if (this.role == 0 && this.region == '') {
      this.getAllData();
    } else if (this.region != '' && this.role == 0) {
      this.getWorkersByRegionId();
    } else if (this.region == '' && this.role != 0) {
      this.getWorkersByRoleId();
    } else {
      this.getWorkersByFilter();
    }
  }

  getWorkersByFilter() {
    return this.http.get(this.baseUrl +'GetWorkerByFilter?RegionID=' + this.region + '&RoleID=' + this.role)
      .subscribe({
        next: (res) => {
          this.employees = res as Employee[];
        },
        error: (err) => {
          this.employees = [];
        },
      });
  }

  getWorkersByRegionId() {
    return this.http.get(this.baseUrl + 'GetWorkersByRegionId?RegionID=' + this.region)
      .subscribe({
        next: (res) => {
          this.employees = res as Employee[];
        },
        error: (err) => {
          this.employees = [];
        },
      });
  }

  getWorkersByRoleId() {
    return this.http.get(this.baseUrl + 'GetWorkersByRoleId?RoleID=' + this.role)
      .subscribe({
        next: (res) => {
          this.employees = res as Employee[];
        },
        error: (err) => {
          this.employees = [];
        },
      });
  }

  getProsumerCout():Observable<any>
  {
    return this.http.get<any>('https://localhost:7156/api/DashboardData/ProsumerCount');
  }
}
