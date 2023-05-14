import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employeestable';
import { lastValueFrom } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { editEmployeeDto } from '../models/editEmployee';
import { environment } from 'src/enviroments/enviroment';
import { text } from 'd3';

@Injectable({
  providedIn: 'root',
})
export class EmployeesServiceService {
  update$: any;

  region: string = '';
  role!: number;
  employees!: Employee[];
  formData: Employee = new Employee();
  idEmp!:string;

  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  getAllData() {
    return this.http
      .get(this.baseUrl + 'Dso/GetAllDsoWorkers')
      .subscribe((res) => {
        this.employees = res as Employee[];
        
      });
  }

  updateEmployee(id: string, dto: editEmployeeDto): Observable<any>  {
    return this.http.put(this.baseUrl + 'Dso/UpdateDsoWorker?id=' + id, dto,{responseType:'text'});
  
  }
  changePassword(id: string, oldPass:string,newPass:string) {
    return this.http.put(this.baseUrl + 'Dso/ChangePasswordDispatcher?id=' + id+'&oldPassword='+oldPass+'&newPassword='+newPass,{} );
  
  }

  deleteEmployee(id: string) {
    return this.http.delete(`${this.baseUrl}Dso/DeleteDsoWorker` + `?id=` + id);
  }

  detailsEmployee(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Dso/GetDsoById` + `?id=` + id);
  }

  Page(page: number, pagesize: number) {
    return this.http.get(
      `${this.baseUrl}Dso/GetDsoWorkerPaging?PageNumber=` +
        page +
        `&PageSize=` +
        pagesize
    );
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
    return this.http
      .get(
        this.baseUrl +
          'Dso/GetWorkerByFilter?RegionID=' +
          this.region +
          '&RoleID=' +
          this.role
      )
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
    return this.http
      .get(this.baseUrl + 'Dso/GetWorkersByRegionId?RegionID=' + this.region)
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
    return this.http
      .get(this.baseUrl + 'Dso/GetWorkersByRoleId?RoleID=' + this.role)
      .subscribe({
        next: (res) => {
          this.employees = res as Employee[];
        },
        error: (err) => {
          this.employees = [];
        },
      });
  }

  deleteProfilePhoto(id : string)
  {
    return this.http.delete(this.baseUrl+'Dso/'+id+'/DeleteImage');
  }
  updateProfilePhoto(id : string, photo : any)
  {
    return this.http.post(this.baseUrl + 'Dso/' + id + '/UploadImage', photo);
  }
}
