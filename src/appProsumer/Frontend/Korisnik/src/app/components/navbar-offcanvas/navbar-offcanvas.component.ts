import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-navbar-offcanvas',
  templateUrl: './navbar-offcanvas.component.html',
  styleUrls: ['./navbar-offcanvas.component.css']
})
export class NavbarOffcanvasComponent implements OnInit, OnDestroy{

  deviceWidth!: number;
  resizeObservable$!: Observable<Event>
  resizeSubscription$!: Subscription
  
  constructor(
    private widthService : DeviceWidthService,
    private router: Router, 
    private cookie: CookieService,
    private auth : AuthServiceService
    ) {}
  ngOnInit(): void {
    const offcanv = document.getElementById('offcanv');
    const offcanvBody = document.getElementById('offcanvBody');
    offcanv!.style.height = this.widthService.height + 'px';
    offcanvBody!.style.height = this.widthService.height + 'px';
    this.deviceWidth = this.widthService.deviceWidth;
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.deviceWidth = this.widthService.deviceWidth;
      offcanv!.style.height = this.widthService.height + 'px';
      offcanvBody!.style.height = this.widthService.height + 'px';
    });
  }
  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }

  logout()
  {
    this.auth.logout()
    .subscribe({
      next:(res)=>{
        this.cookie.delete('tokenProsumer','/');
        this.cookie.delete('refreshProsumer', '/');
        localStorage.removeItem('usernameProsumer');
        localStorage.removeItem('roleProsumer');
        localStorage.removeItem('idProsumer');
        this.router.navigateByUrl("login");
      },
      error:(err)=>{
        this.cookie.delete('tokenProsumer','/');
        this.cookie.delete('refreshProsumer','/');
        localStorage.removeItem('usernameProsumer');
        localStorage.removeItem('roleProsumer');
        localStorage.removeItem('idProsumer');
        this.router.navigateByUrl("login");
      }
    });
  }
}
