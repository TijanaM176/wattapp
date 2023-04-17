import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DevicesService } from 'src/app/services/devices.service';

@Component({
  selector: 'app-consumption-limit',
  templateUrl: './consumption-limit.component.html',
  styleUrls: ['./consumption-limit.component.css']
})
export class ConsumptionLimitComponent implements OnInit, AfterViewInit {

  loaded : boolean = false;
  width : number = 250;
  consumption : number = 0;

  gaugeLabel = "Consumption";
  gaugeAppendText = "kW";

  constructor(private deviceService : DevicesService) {}

  ngAfterViewInit(): void {
    document.getElementById('consumptionLimitBody')!.style.height = (window.innerHeight*0.6) + 'px';
  }

  ngOnInit(): void {
    this.loaded = false;
    this.width = document.getElementById('consumptionLimitCardBody')!.offsetWidth*0.9;
  }

  getConumptionAndProductionLimit()
  {
    this.deviceService.getConsumptionAndProductionLimit()
    .subscribe({
      next:(res)=>{
        this.loaded = true;
        this.consumption = res.consumption;
      },
      error:(err)=>{
        this.loaded = false;
        console.log(err.error);
      }
    })
  }
}
