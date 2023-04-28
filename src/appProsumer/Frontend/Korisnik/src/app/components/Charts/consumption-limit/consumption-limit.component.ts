import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-consumption-limit',
  templateUrl: './consumption-limit.component.html',
  styleUrls: ['./consumption-limit.component.css']
})
export class ConsumptionLimitComponent implements OnInit, AfterViewInit {

  loaded : boolean = false;
  width : number = 250;
  thickness : number = 30;
  consumption : number = 0;
  production : number = 0;

  gaugeLabel = "Consumption";
  gaugeAppendText = "kW";

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  constructor(private deviceService : DevicesService, private widthService : DeviceWidthService) {}

  ngAfterViewInit(): void {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if(w>=576)
    {
      document.getElementById('consumptionLimitBody')!.style.height = (h*0.6) + 'px';
      this.thickness = 45;
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

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      let w = this.widthService.deviceWidth;
      let h = this.widthService.height;
      if(w>=576)
      {
        document.getElementById('consumptionLimitBody')!.style.height = (h*0.6) + 'px';
        this.thickness = 45;
        this.width = document.getElementById('consumptionLimitCardBody')!.offsetWidth*0.9;
      }
      else
      {
        document.getElementById('consumptionLimitBody')!.style.height = (h*0.4) + 'px';
        this.thickness = 30;
        this.width = document.getElementById('consumptionLimitCardBody')!.offsetWidth*0.9;
      }
    });
  }

  getConumptionAndProductionLimit()
  {
    this.deviceService.getConsumptionAndProductionLimit()
    .subscribe({
      next:(res)=>{
        this.loaded = true;
        this.consumption = res.consumption.toFixed(1);
        this.production = res.production.toFixed(1);
      },
      error:(err)=>{
        this.loaded = false;
        console.log(err.error);
      }
    })
  }
}
