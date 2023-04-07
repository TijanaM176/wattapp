import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit{
  
  deviceWidth!: number;
  navBarHeight!: number;
  resizeObservable$!: Observable<Event>
  resizeSubscription$!: Subscription;
  content : any;
  region : string = '';

  constructor(
    private widthService : ScreenWidthService,
    private employeeService : EmployeesServiceService,
    private cookie : CookieService
  ) {}
  ngAfterViewInit(): void {
    this.content.style.height = this.widthService.height+'px';
  }

  ngOnInit(): void {
    this.content = document.getElementById("content");
    if(window.innerWidth>320)
    {
      let height = window.innerHeight - 100;
      this.widthService.height = height;
    }
    else
    {
      let height = window.innerHeight - 139.6;
      this.widthService.height = height;
    }
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      if(window.innerWidth>320)
      {
        let height = window.innerHeight - 100;
        this.widthService.height = height;
        this.content.style.height = this.widthService.height+'px';
      }
      else
      {
        let height = window.innerHeight - 139.6;
        this.widthService.height = height;
        this.content.style.height = this.widthService.height+'px';
      }
    });
    this.getRegion();
  }

  private getRegion()
  {
    this.cookie.set('region', 'Šumadija', {path:'/'});
    this.cookie.set('lat','43.983334', {path:'/'});
    this.cookie.set('long','20.883333', {path:'/'})
  }
}
