import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})
export class HouseComponent implements OnInit,AfterViewInit {

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  devices: any[] = [];

  @Output() deviceOffOn = new EventEmitter<[any[], number, number,string]>();
  offOn : string = 'On';
  lastState : string = 'Off';
  index : number = 0;
  device : any;
  show : boolean = false;
  lastValue : number = 0;
  
  constructor(private widthService: DeviceWidthService, private deviceService : DeviceserviceService) {}

  ngAfterViewInit(): void {
    const houseCont = document.getElementById('houseCont');
    let houseHeight;
    if(window.innerHeight >= window.innerWidth*2)
    {
      houseHeight = this.widthService.height*0.5;
    }
    else
    {
      houseHeight = this.widthService.height*0.6;
    }
    houseCont!.style.height = houseHeight + 'px';
  }
  
  ngOnInit(): void {
    
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      const houseCont = document.getElementById('houseCont');
      let houseHeight;
      if(window.innerHeight >= window.innerWidth*2)
      {
        houseHeight = this.widthService.height*0.45;
      }
      else
      {
        houseHeight = this.widthService.height*0.6;
      }
      houseCont!.style!.height = houseHeight + 'px';
    });
  }

  setDevices(devices : any[])
  {
    this.devices = devices;
    // console.log(devices);
  }

  turnDeviceoffOn()
  {
    this.show = false;
    this.deviceService.toggleDevice(this.device.Id, true)
    .subscribe((response) => {
      if(response==0)
      {
        this.lastValue = this.device.CurrentUsage;
      }
      this.devices[this.index].CurrentUsage = response;
      this.device.CurrentUsage = response;
      this.offOn = this.device.CurrentUsage>0? 'Off' : 'On';
      this.lastState = this.device.CurrentUsage>0? 'On' : 'Off';
      this.show = true;
      this.deviceOffOn.emit([this.devices,this.device.CurrentUsage, this.lastValue,this.device.CategoryId]);
      // console.log(this.devices);
    });
  }
  selectedDevice(index : number)
  {
    this.index = index;
    this.device = this.devices[this.index];
    this.offOn = this.device.CurrentUsage>0? 'Off' : 'On';
  }
  reset()
  {
    this.show = false;
  }
}
