import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NgToastService } from 'ng-angular-popup';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-userDevices',
  templateUrl: './userDevices.component.html',
  styleUrls: ['./userDevices.component.css'],
})
export class UserDevicesComponent implements OnInit, OnDestroy {
  deviceWidth!: number;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  loader:boolean=true;
  constructor(private widthService: DeviceWidthService) {}

  ngOnInit() {
    this.deviceWidth = this.widthService.deviceWidth;
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.widthService.deviceWidth = window.innerWidth;
      this.deviceWidth = this.widthService.deviceWidth;
    });
    setTimeout(()=>{
      this.loader=false;
    },2000);
  }

  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }
}
