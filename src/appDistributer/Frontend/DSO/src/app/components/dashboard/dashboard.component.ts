import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ScreenWidthService } from 'src/app/services/screen-width.service';

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

  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthServiceService,
    private toast: NgToastService,
    private widthService : ScreenWidthService
  ) {}
  ngAfterViewInit(): void {
    this.content.style.height = this.widthService.height;
  }

  ngOnInit(): void {
    this.content = document.getElementById("content");
    if(window.innerWidth>320)
    {
      let height = window.innerHeight - 101;
      this.widthService.height = height;
    }
    else
    {
      let height = window.innerHeight - 140.6;
      this.widthService.height = height;
    }
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      if(window.innerWidth>320)
      {
        let height = window.innerHeight - 101;
        this.widthService.height = height;
      }
      else
      {
        let height = window.innerHeight - 140.6;
        this.widthService.height = height;
      }
    });
  }
}
