import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from './shared-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'demoApp';

  constructor(private service:SharedServiceService)
  {

  }
  ngOnInit(): void {
    this.getAllWorkers();
  }

  getAllWorkers()
  {
    this.service.getWorkersList()
    .subscribe(
      responce => {
        console.log(responce);
      }
    );
  }
}
