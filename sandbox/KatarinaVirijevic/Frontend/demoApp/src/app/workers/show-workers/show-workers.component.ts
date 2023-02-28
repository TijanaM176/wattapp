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

  ngOnInit(): void {
    this.getAllWorkers();
  }

  getAllWorkers()
  {
    this.service.getWorkersList()
    .subscribe(
      responce => {
        //console.log(responce);
        this.workers = responce;
        console.log(this.workers);
      }
    );
  }
}
