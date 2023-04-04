import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

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
    private toast: NgToastService
  ) {}
  ngAfterViewInit(): void {
    this.navBarHeight = document.getElementById('navBar')!.offsetHeight;
    let height = window.innerHeight - 101;
    document.getElementById("content")!.style.height = height + 'px';
    //console.log(this.navBarHeight)
  }

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.navBarHeight = document.getElementById('navBar')!.offsetHeight;
      let height = window.innerHeight - this.navBarHeight;
    document.getElementById("content")!.style.height = height + 'px';
      //console.log(this.navBarHeight)
    });
  }
}
