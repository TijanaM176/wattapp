import { Component, OnInit } from '@angular/core';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.css']
})
export class HomeSidebarComponent implements OnInit{

  region : string = '';
  currConsumption : string = '';
  currProduction : string = '';
  numOfUsers : string = '';

  constructor(private deviceService : DeviceserviceService) {}

  ngOnInit(): void {
    this.getConsumptionProduction()
  }

  private getConsumptionProduction()
  {
    this.deviceService.getCurrConsumptionAndProduction()
    .subscribe({
      next:(res)=>{
        this.currConsumption = res.totalConsumption;
        this.currProduction = res.totalProduction;
      }
    })
  }
}
