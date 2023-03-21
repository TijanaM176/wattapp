import { Component, OnInit } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'ngx-toastr';
import { Employee } from 'src/app/models/employeestable';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent{
  searchName:string='';
  //employees!:Observable<any[]>;
  employees:any;
  Data:any;
  constructor(public service:EmployeesServiceService,private router:Router){
    this.Ucitaj();
  }
  
  
  ngOnInit():void{
    
    //console.log(this.service.employees);
  }
  Ucitaj(){
    this.service.getAllData().subscribe(res=>{
      this.employees=res;
      console.log(this.employees);
    })
  }
  Details(id:string){
   this.service.detailsEmployee(id).subscribe(res=>{
    this.Data=res;
    if(this.Data!=null){
      console.log(this.employees);
    }
   });
  }

  onDelete(id:string){
    if(confirm("Do you want to delete ?")){
      this.service.deleteEmployee(id).subscribe(res=>{
        this.Ucitaj();
      });
    }
  }
  
  
}
