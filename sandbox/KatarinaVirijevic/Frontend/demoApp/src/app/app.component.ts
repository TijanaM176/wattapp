import { Component, OnInit } from '@angular/core';
import { INewWorker } from './models/newWorker.model';
import { IWorker } from './models/worker.model';
import { SharedServiceService } from './shared-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'demoApp';
  workers : IWorker[] = [];

  worker : IWorker = {
    id : '',
    name : '',
    department : '',
    age : 0
  }; //used to populate form and save info we provided in it

  newWorker : INewWorker = {
    Name : '',
    Department : '',
    Age : 0
  };

  constructor(private service:SharedServiceService)
  {

  }
  ngOnInit(): void {
    this.getAllWorkers();
    //this.getAllDeps(); samo za proveru
  }

  getAllWorkers()
  {
    this.service.getWorkersList()
    .subscribe(
      response => {
        //console.log(responce);
        this.workers = response;
      }
    );
  }

  addUpdateWorker()
  {
    if(this.worker.id === '') //if id is empty, we're adding a new worker
    {
      this.newWorker.Name = this.worker.name;
      this.newWorker.Department = this.worker.department;
      this.newWorker.Age = this.worker.age;

      this.service.addWorker(this.newWorker)
      .subscribe(
        responce => {
          console.log(responce);
          /*this.getAllWorkers();
          this.newWorker = {
            Name : '',
            Department : '',
            Age : 0
          }; //clear the form
          */
        }
      )
    }
    else
    {
      this.newWorker.Name = this.worker.name;
      this.newWorker.Department = this.worker.department;
      this.newWorker.Age = this.worker.age;

      this.service.updateWorker(this.worker.id, this.newWorker)
      .subscribe(
        response => {
          console.log(response);
          /*this.getAllWorkers();
          this.newWorker = {
            Name : '',
            Department : '',
            Age : 0
          }; //clear the form
          */
        }
      )
    }
  }

  populateForm(w : IWorker)
  {
    this.worker = w;
  }

  deleteWorker(id : any)
  {
    this.service.deleteWorker(id)
    .subscribe(
      response => {
        console.log(response);
        //this.getAllWorkers();
      }
    );
  }
  /*getAllDeps()
  {
    this.service.getDepartmentList()
    .subscribe(
      response =>{
        console.log(response);
      }
    );
  }*/
}
