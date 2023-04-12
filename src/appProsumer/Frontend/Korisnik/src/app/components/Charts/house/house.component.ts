import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})
export class HouseComponent implements OnInit,AfterViewInit {

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  devices: any[] = [];
  deviceUsages: { [key: string]: number } = {};
  show : boolean = false;
  
  constructor(private widthService: DeviceWidthService) {}

  ngAfterViewInit(): void {
    const houseCont = document.getElementById('houseCont');
    let houseHeight = this.widthService.height*0.65;
    houseCont!.style.height = houseHeight + 'px';
  }
  
  ngOnInit(): void {
    
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      const houseCont = document.getElementById('houseCont');
      let houseHeight = this.widthService.height*0.65;
      houseCont!.style.height = houseHeight + 'px';
    });
  }

  setDevices(devices : any[], usages : { [key: string]: number })
  {
    //this.show = true;
    this.devices = devices;
    this.deviceUsages = usages;
  }

}
