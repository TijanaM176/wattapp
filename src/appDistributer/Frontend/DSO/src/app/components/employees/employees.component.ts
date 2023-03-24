import { Component, OnInit } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { lastValueFrom, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'ngx-toastr';
import { Employee } from 'src/app/models/employeestable';
import { Router } from '@angular/router';


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
  tableSizes:any=[10,15,20];

  constructor(public service: EmployeesServiceService, private router: Router) {
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
  onTableSizeChange(event:any):void
{
  this.perPage=event.target.value;
  this.page=1;
  this.Paging();
}  

  Details(id: string) {
    this.service.detailsEmployee(id).subscribe(res => {
      this.employee = res;
     
        console.log(this.employee);
        //this.router.navigate(['/employeedetails']);
        console.log(id);
      
    });
  }


  onDelete(id: string) {
    if (confirm('Do you want to delete ?')) {
      this.service.deleteEmployee(id)
      .subscribe(
       (res:any)=>{
        this.Ucitaj();
        this.Paging();
       });
    }
  }


}
