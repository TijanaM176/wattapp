import { Component, OnInit, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
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
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit{

  deviceWidth!: number;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  content : any;

  constructor(private router: Router, private cookie: CookieService, private auth: AuthServiceService, private toast: NgToastService, private widthService : DeviceWidthService) {}
  

  ngOnInit(): void {
    this.deviceWidth = this.widthService.deviceWidth;
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.widthService.deviceWidth = window.innerWidth;
      this.deviceWidth = this.widthService.deviceWidth;

      if(window.innerWidth<=280)
      {
        let height = window.innerHeight - 104.69;
        this.content.style.height = height + 'px';
      }
      else
      {
        let height = window.innerHeight - 65.09;
        this.content.style.height = height + 'px';
      }
    });
  }

  ngAfterViewInit(): void {
    this.content = document.getElementById('content');
    let height = window.innerHeight - 65.09;
    this.content.style.height = height + 'px';
  }

  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }

  // @HostListener('window:resize',['$event'])
  // onResize(evet : any){
  //   this.widthService.deviceWidth = evet.target.innerWidth;
  // }

}
