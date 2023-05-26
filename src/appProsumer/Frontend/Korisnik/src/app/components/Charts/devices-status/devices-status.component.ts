import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-devices-status',
  templateUrl: './devices-status.component.html',
  styleUrls: ['./devices-status.component.css']
})
export class DevicesStatusComponent implements OnInit, AfterViewInit {

  currentConsumption : number = 0;
  currentProduction : number = 0;
  devices : any[] = [];
  deviceUsages: { [key: string]: number } = {};

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  show!:boolean;
  constructor(private widthService : DeviceWidthService, private devicesService  : DevicesService) {}

  ngAfterViewInit(): void {
    const devicesStatusBody = document.getElementById('devicesStatusBody');
    
    if(this.widthService.deviceWidth > this.widthService.height)
    {
      devicesStatusBody!.style.minHeight = '300px';
    }
    devicesStatusBody!.style.maxHeight = (this.widthService.height*0.65) + 'px';
  }
  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      const devicesStatusBody = document.getElementById('devicesStatusBody');
      devicesStatusBody!.style!.maxHeight = (this.widthService.height*0.65) + 'px';
    });
  }

  setDevices(devs : any[])
  {
    this.devices = devs;
  }

  getProcentage(device : any, category : string) : string
  {
    let kw = device.CurrentUsage;

    let proc = 0;

    if(category == '1')
    {
      proc = (kw*100)/this.currentConsumption;
    }
    else if(category == '2')
    {
      proc = (kw*100)/this.currentProduction;
    }
    //console.log(proc);
    return proc.toString();
  }

  getBatteryPercentage(device : any)
  {
    return (device.CurrentUsage/device.Wattage)*100;
  }

  setCurrentConsumptionAndProduction(cons : number, prod : number)
  {
    this.currentConsumption = cons;
    this.currentProduction = prod;
    // this.devicesService.getCurrentConsumptionAndProduction()
    // .subscribe({
    //   next:(res)=>{
    //     this.currentConsumption = res.consumption;
    //     this.currentProduction = res.production;
    //   },
    //   error:(err)=>{
    //     console.log(err.error);
    //   }
    // });
  }
}
