import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from 'src/app/services/data.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-emloyeedetail',
  templateUrl: './emloyeedetail.component.html',
  styleUrls: ['./emloyeedetail.component.css']
})
export class EmloyeedetailComponent{
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
  idEmp!:string;
  constructor(
    public service: EmployeesServiceService,
    private router: Router,
    private cookie: CookieService,
    public serviceData:DataService
  ) {
  }
  ngOnInit(): void{
    
  }
  Details() {
    this.idEmp=this.service.idEmp;
    console.log(this.idEmp);
    this.service.detailsEmployee(this.idEmp).subscribe((res) => {
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
    const buttonRef = document.getElementById('closeBtn3');
    buttonRef?.click();

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
  onDelete(id: string) {
    if (confirm('Do you want to delete ?')) {
      this.service.deleteEmployee(id).subscribe({
        next: (res) => {

        },
        error: (err) => {
          console.log(err.error);
        },
      });
    }
  }
  
}
