import { Component, Input, OnInit } from '@angular/core';
import { IDefaultResponce } from 'src/app/models/defaultResponce';
import { IDepartment } from 'src/app/models/department.model';
import { INewWorker } from 'src/app/models/newWorker.model';
import { SharedServiceService } from 'src/app/shared-service.service';

@Component({
  selector: 'app-add-edit-workers',
  templateUrl: './add-edit-workers.component.html',
  styleUrls: ['./add-edit-workers.component.css']
})
export class AddEditWorkersComponent implements OnInit{
  
  constructor(private service : SharedServiceService) {}

  @Input() empl:any;
  workerId:string='';
  workerName:string='';
  workerDepartment:string='--Select--';
  workerAge:number=0;

  departments : IDepartment[] =[];
  
  ngOnInit(): void {
    this.getAllDepartments();
  }

  addWorker()
  {
    if(this.workerName!="" && this.workerDepartment!="--Select--" && this.workerDepartment!="" && this.workerAge!=0)
    {
      var newWorker:INewWorker = {
        Name : this.workerName,
        Department : this.workerDepartment,
        Age : this.workerAge
      } 
      this.service.addWorker(newWorker)
      .subscribe(
        response =>{
          alert(response.message);
        }
      );
    }
    else
    {
      alert("Populate All Fields!");
    }
  }

  editWorker()
  {
    if(this.workerName!="" && this.workerDepartment!="--Select--" && this.workerDepartment!="" && this.workerAge!=0)
    {
      var updateWorker : INewWorker = {
        Name : this.workerName,
        Department : this.workerDepartment,
        Age : this.workerAge
      }
      this.service.updateWorker(this.workerId,updateWorker)
      .subscribe(
        response =>{
          alert(response.message);
          }
      );
    }
    else
    {
      alert("Populate All Fields!");
    }
  }

  getAllDepartments()
  {
    this.service.getDepartmentList()
    .subscribe(
      response =>{
        this.departments = response
        //console.log(this.departments);
        
      this.workerId = this.empl.id;
      this.workerName = this.empl.name;
      this.workerDepartment = this.empl.department;
      this.workerAge = this.empl.age;
      }
    );
  }
}
