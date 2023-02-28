import { Component, OnInit } from '@angular/core';
import { IWorker } from 'src/app/models/worker.model';
import { SharedServiceService } from 'src/app/shared-service.service';

@Component({
  selector: 'app-show-workers',
  templateUrl: './show-workers.component.html',
  styleUrls: ['./show-workers.component.css']
})
export class ShowWorkersComponent implements OnInit {
  
  constructor(private service : SharedServiceService) {}

  workers : IWorker[] = [];
  ModalTitle : string='';
  ActivateAddEditWorkersComp : boolean =false;
  empl: any;

  ngOnInit(): void {
    this.getAllWorkers();
  }

  addClick()
  {
    this.empl={
      id:0,
      name:"",
      department:"",
      age:0
    }
    this.ModalTitle = "Add Employee";
    this.ActivateAddEditWorkersComp = true;
  }

  closeClick()
  {
    this.ActivateAddEditWorkersComp = false;
    this.getAllWorkers();
  }

  editClick(item:any)
  {
    this.empl = item;
    this.ModalTitle = "Edit Employee";
    this.ActivateAddEditWorkersComp = true;
  }

  deleteClick(item:any)
  {
    if(confirm("Are you sure?"))
    {
      this.service.deleteWorker(item.id)
      .subscribe(
        response =>{
          alert(response.message);
          this.getAllWorkers();
        }
      );
    }
  }

  getAllWorkers()
  {
    this.service.getWorkersList()
    .subscribe(
      responce => {
        //console.log(responce);
        this.workers = responce;
        //console.log(this.workers);
      }
    );
  }
}
