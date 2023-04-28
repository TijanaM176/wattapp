import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { editEmployeeDto } from 'src/app/models/editEmployee';
import { DataService } from 'src/app/services/data.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.css']
})
export class EditemployeeComponent {
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
}
