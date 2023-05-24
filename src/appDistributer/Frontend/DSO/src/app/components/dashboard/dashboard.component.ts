import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  deviceWidth!: number;
  navBarHeight!: number;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  content: any;
  region: string = '';

  constructor(
    private widthService: ScreenWidthService,
    private employeeService: EmployeesServiceService,
    private cookie: CookieService
  ) {}
  ngAfterViewInit(): void {
    this.content.style.height = this.widthService.height + 'px';
  }

  ngOnInit(): void {
    this.content = document.getElementById('content');
    if (window.innerWidth > 320) {
      let height = window.innerHeight - 101;
      this.widthService.height = height;
    } else {
      let height = window.innerHeight - 140.6;
      this.widthService.height = height;
    }
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      if (window.innerWidth > 320) {
        let height = window.innerHeight - 101;
        this.widthService.height = height;
        this.content.style.height = this.widthService.height + 'px';
      } else {
        let height = window.innerHeight - 140.6;
        this.widthService.height = height;
        this.content.style.height = this.widthService.height + 'px';
      }
    });
    this.getRegion();
  }

  private getRegion() {
    localStorage.setItem('region', 'Šumadija');
    localStorage.setItem('lat','43.983334');
    localStorage.setItem('long','20.883333');
  }
}
