import { Component, OnInit } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'ngx-toastr';
import { Employee } from 'src/app/models/employeestable';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent {
  searchName: string = '';
  //employees!:Observable<any[]>;
  employees: any;
  employee: any;
  total!:number;
  perPage:number=10;
  pagenum!:number;
  page:number=1;
  show:boolean=false;
  value!:string;
  tableSizes:any=[10,15,20];
  updateForm=new FormGroup({
    firstName:new FormControl(''),
    lastName:new FormControl(''),
    salary:new FormControl(''),
    roleId:new FormControl(''),
    regionId:new FormControl(''),
    email:new FormControl(''),
    password:new FormControl('')
  })
  infoForm=new FormGroup({
    firstName:new FormControl(''),
    lastName:new FormControl(''),
    dateCreate:new FormControl(''),
    salary:new FormControl(''),
    role:new FormControl(''),
    region:new FormControl(''),
    email:new FormControl('')
  })
  constructor(public service: EmployeesServiceService, private router: Router,private cookie: CookieService) {
    this.Ucitaj();
    this.Paging();
  }

  ngOnInit(): void {
    //console.log(this.service.employees);
  }
  Ucitaj() {
    this.service.getAllData().subscribe((res) => {
      this.employees = res;
      //console.log(this.employees);
      this.total=this.employees.length;
      this.pagenum=(this.total/this.perPage)+1;
      this.pagenum=Math.floor(this.pagenum);
      console.log(this.pagenum);
    });
  }
  Paging(){
    this.service.Page(this.page,this.perPage).subscribe((res)=>{
      this.employees=res;
      console.log(this.employees);
    });
  }
  onTableDataChange(event:any){
    this.page=event;
    console.log(this.page);
    this.Paging();
    
  }
 /* onTableSizeChange(event:any):void
{
  this.perPage=event.target.value;
  this.page=1;
  this.Paging();
}  */

  Details(id: string) {
    this.service.detailsEmployee(id).subscribe(res => {
      this.employee = res;
      console.log(res);
      this.cookie.set("id",this.employee.id);
      this.value=this.cookie.get("role");
      this.infoForm=new FormGroup({
        firstName:new FormControl(this.employee.firstName),
        lastName:new FormControl(this.employee.lastName),
        dateCreate:new FormControl(this.employee.dateCreate),
        salary:new FormControl(this.employee.salary),
        role:new FormControl(this.employee.role),
        region:new FormControl(this.employee.region),
        email:new FormControl(this.employee.email)
       
      });
        //console.log(this.employee);
        //this.router.navigate(['/employeedetails']);
        //console.log(id);
      
      
    });
  } 
  update(id:string){
    this.service.detailsEmployee(id).subscribe((res) => {
      console.log(res);
      this.employee=res;
      
      this.updateForm=new FormGroup({
        firstName:new FormControl(this.employee.firstName),
        lastName:new FormControl(this.employee.lastName),
        salary:new FormControl(this.employee.salary),
        roleId:new FormControl(this.employee.roleId),
        regionId:new FormControl(this.employee.regionId),
        email:new FormControl(this.employee.email),
        password:new FormControl(this.employee.password)
      });
    
      console.log(id);
      const buttonRef=document.getElementById("closeBtn");
      buttonRef?.click();
    });
  }
  onUpdate(id:string){
    console.log(this.updateForm.value);
    this.service.updateEmployee(id,this.updateForm.value).subscribe(
      (res)=>{
        console.log(res);
        //this.resetForm(this.updateForm);
        this.Details(id);
  });
  const buttonRef=document.getElementById("closeBtn1");
  buttonRef?.click();
  }
  /*
  resetForm(form:any){
    form.form.reset();
    this.infoForm=new FormGroup();
  }*/


  onDelete(id: string) {
    if (confirm('Do you want to delete ?')) {
      this.service.deleteEmployee(id)
      .subscribe({
        next:(res)=>{
          //alert(res.message);
          this.Ucitaj();
          this.Paging();
          //console.log(res);
          //console.log(this.resetPasswordEmail);
        },
        error:(err)=>{
          
          console.log(err.error);
        }
    });
    }
  }


}
