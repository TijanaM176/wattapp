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
    let w = window.innerWidth;
    let h = window.innerHeight;
    if(w>=576)
    {
      document.getElementById('consumptionLimitBody')!.style.height = (h*0.6) + 'px';
    }
    else
    {
      document.getElementById('consumptionLimitBody')!.style.height = (h*0.4) + 'px';
    }
  }

  ngOnInit(): void {
    this.loaded = false;
    this.width = document.getElementById('consumptionLimitCardBody')!.offsetWidth*0.9;
    this.getConumptionAndProductionLimit();
  }

  getConumptionAndProductionLimit()
  {
    this.deviceService.getConsumptionAndProductionLimit()
    .subscribe({
      next:(res)=>{
        this.loaded = true;
        this.consumption = res.consumption.toFixed(1);
      },
      error:(err)=>{
        this.loaded = false;
        console.log(err.error);
      }
    })
  }
}
