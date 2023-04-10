import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-responsive',
  templateUrl: './sidebar-responsive.component.html',
  styleUrls: ['./sidebar-responsive.component.css']
})
export class SidebarResponsiveComponent implements OnInit, AfterViewInit{

  sideBar : any;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  constructor(private router: Router, private cookie: CookieService, private auth: AuthServiceService, private toast: NgToastService) {}
  
  ngAfterViewInit(): void {
    this.sideBar = document.getElementById('sadrzaj');
    let height = window.innerHeight - 65.09;
    this.sideBar.style.height = height+'px';
  }

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
        let height = window.innerHeight - 65.09;
        this.sideBar.style.height = height + 'px';
    })
  }

  logout()
  {
    this.cookie.deleteAll('/');
    this.router.navigate(["login"]);
  }

  viewProfile()
  {
    
  }
}
