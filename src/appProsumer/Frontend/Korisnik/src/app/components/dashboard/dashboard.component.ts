import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NgToastService } from 'ng-angular-popup';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{

  deviceWidth!: number;
  resizeObservable$!: Observable<Event>
  resizeSubscription$!: Subscription

  constructor(private router: Router, private cookie: CookieService, private auth: AuthServiceService, private toast: NgToastService, private widthService : DeviceWidthService) {}

  ngOnInit(): void {
    this.deviceWidth = this.widthService.deviceWidth;
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.widthService.deviceWidth = window.innerWidth;
      this.deviceWidth = this.widthService.deviceWidth;
    });
  }

  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }

  // @HostListener('window:resize',['$event'])
  // onResize(evet : any){
  //   this.widthService.deviceWidth = evet.target.innerWidth;
  // }

}
