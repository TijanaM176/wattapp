import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-userDevices',
  templateUrl: './userDevices.component.html',
  styleUrls: ['./userDevices.component.css'],
})
export class UserDevicesComponent implements OnInit, OnDestroy {
  deviceWidth!: number;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  loader: boolean = true;
  constructor(
    private widthService: DeviceWidthService,
    private spiner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spiner.show();
    this.deviceWidth = this.widthService.deviceWidth;
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.widthService.deviceWidth = window.innerWidth;
      this.deviceWidth = this.widthService.deviceWidth;
    });
  }

  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }
}
