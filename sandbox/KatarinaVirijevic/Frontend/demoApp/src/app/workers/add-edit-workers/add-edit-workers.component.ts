import { Component, Input, OnInit } from '@angular/core';
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
  workerDepartment:string='';
  workerAge:number=0;
  
  ngOnInit(): void {
    this.workerId = this.empl.id;
    this.workerName = this.empl.name;
    this.workerDepartment = this.empl.department;
    this.workerAge = this.empl.age;
  }

  addWorker()
  {
    var newWorker:INewWorker = {
      Name : this.workerName,
      Department : this.workerDepartment,
      Age : this.workerAge
    } 
    this.service.addWorker(newWorker)
    .subscribe(
      response =>{
        if(response.length!=0){
          alert("Employee successfully added!");
        }
      }
    );
  }

  editWorker()
  {
    var updateWorker : INewWorker = {
      Name : this.workerName,
      Department : this.workerDepartment,
      Age : this.workerAge
    }
    this.service.updateWorker(this.workerId,updateWorker)
    .subscribe(
      response =>{
        if(response.length!=0){
          alert("Employee successfully edited!");
        }
      }
    );
  }

}
