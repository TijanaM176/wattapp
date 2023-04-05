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

  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthServiceService,
    private toast: NgToastService,
    private widthService : ScreenWidthService
  ) {}
  ngAfterViewInit(): void {
    let height = window.innerHeight - 101;
    document.getElementById("content")!.style.height = height + 'px';
    //console.log(height);
  }

  ngOnInit(): void {
    if(window.innerWidth>320)
    {
      let height = window.innerHeight - 101;
      this.widthService.height = height;
      console.log(height);
    }
    else
    {
      let height = window.innerHeight - 140.6;
      this.widthService.height = height;
    }
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      //this.navBarHeight = document.getElementById('navBar')!.offsetHeight;
      if(window.innerWidth>320)
      {
        let height = window.innerHeight - 101;
        document.getElementById("content")!.style.height = height + 'px';
        this.widthService.height = height;
      }
      else
      {
        let height = window.innerHeight - 140.6;
        document.getElementById("content")!.style.height = height + 'px';
        this.widthService.height = height;
      }
      //console.log(this.navBarHeight)
    });
  }
}
