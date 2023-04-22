import { Component, OnInit } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'ngx-toastr';
import { Employee } from 'src/app/models/employeestable';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { editEmployeeDto } from 'src/app/models/editEmployee';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent {
  searchName: string = '';
  employees: any;
  employee: any;
  total!: number;
  perPage: number = 10;
  pagenum!: number;
  page: number = 1;
  show: boolean = false;
  orderHeader:String='';
  isDescOrder:boolean=true;
  public regionName: any;
  public roleName: any;
  firstName:any;
  lastName:any;
  salary:any;
  email:any;
  dateCreate:any;
  password:any='';
  Role:any;
  Region:any;
  role:any;
  region:any;
  roleId!:number;
  regionId!:string;
  id!:string;
  constructor(
    public service: EmployeesServiceService,
    private router: Router,
    private cookie: CookieService,
    public serviceData:DataService
  ) {
  }

  ngOnInit(): void {
    this.Ucitaj();
    this.Paging();
    this.regionName = this.cookie.get('region');
  }

  Ucitaj() {
    this.service.getAllData();
    this.employees = this.service.employees;

  }
  Paging() {
    this.service.Page(this.page, this.perPage).subscribe((res) => {
      this.employees = res;
    });
  }
  onTableDataChange(event: any) {
    this.page = event;
    console.log(this.page);
    this.Paging();
  }

  Details(id: string) {

    this.service.detailsEmployee(id).subscribe((res) => {
      this.employee = res;
      this.id=res.id;
      this.firstName=res.firstName;
      this.lastName=res.lastName;
      this.salary=res.salary;
      this.dateCreate=res.prosumerCreationDate;
      this.email=res.email;
      this.role=res.roleId;
      this.region=res.regionId;
      // console.log(res);
      // this.serviceData.getRegionName(this.employee.regionId).subscribe((res) => {
      //   console.log(res);
      //   this.regionName = res;
      // });
      this.serviceData.getRoleName(this.employee.roleId).subscribe((res) => {
        // console.log(res);
        this.roleName = res;
      });   
    });

  }
  close(){

  }
  ChangeRegion(e:any){
    
  }
  getAllRegions(){
    this.serviceData.getAllRegions().subscribe({
      next:(res)=>{
        this.Region=res;
      },
      error:(err)=>{
        console.log(err.error);
      }
    });
  }
  ChangeRole(e:any){
    
  }
  getAllRoles(){
    this.serviceData.getAllRoles().subscribe({
      next:(res)=>{
        this.Role=res;
      },
      error:(err)=>{
        //this.toast.error({detail:"Error!",summary:"Unable to load user data.", duration:3000});
        console.log(err.error);
      }
    });
  }

  update(id: string) {

    this.getAllRegions();
    this.getAllRoles();
    const buttonRef = document.getElementById('closeBtn');
    buttonRef?.click();
    
  }
  onUpdate(id: string) {
    //console.log(this.updateForm.value);
    let dto:editEmployeeDto=new editEmployeeDto();
    dto.firstName=this.firstName;
    dto.lastName=this.lastName;
    dto.salary=this.salary;
    dto.regionId=this.region;
    dto.roleId=this.role;
    dto.email=this.email;
    dto.password=this.password;
    console.log(dto);

    this.service.updateEmployee(id,dto).subscribe((res) => {
      console.log(res);
    });
    const buttonRef = document.getElementById('closeBtn1');
    buttonRef?.click();
  }

  onDelete(id: string) {
    if (confirm('Do you want to delete ?')) {
      this.service.deleteEmployee(id).subscribe({
        next: (res) => {
          this.Ucitaj();
          this.Paging();
        },
        error: (err) => {
          console.log(err.error);
        },
      });
    }
  }
  sort(headerName:String){
    this.isDescOrder=!this.isDescOrder;
    this.orderHeader=headerName;
  }
}
