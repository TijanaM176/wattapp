import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-offcanvas',
  templateUrl: './navbar-offcanvas.component.html',
  styleUrls: ['./navbar-offcanvas.component.css']
})
export class NavbarOffcanvasComponent implements OnInit, OnDestroy{

  deviceWidth!: number;
  resizeObservable$!: Observable<Event>
  resizeSubscription$!: Subscription
  
  constructor(private widthService : DeviceWidthService) {
    
  }
  ngOnInit(): void {
    this.deviceWidth = this.widthService.deviceWidth;
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.deviceWidth = this.widthService.deviceWidth;
    });
  }
  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }
}
