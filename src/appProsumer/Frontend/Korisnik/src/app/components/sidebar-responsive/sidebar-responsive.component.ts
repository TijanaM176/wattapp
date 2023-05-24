import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar-responsive',
  templateUrl: './sidebar-responsive.component.html',
  styleUrls: ['./sidebar-responsive.component.css'],
})
export class SidebarResponsiveComponent implements OnInit, AfterViewInit {
  sideBar: any;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthServiceService,
    private toast: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.sideBar = document.getElementById('sadrzaj');
    let height = window.innerHeight - 65.09;
    this.sideBar.style.height = height + 'px';
  }

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      let height = window.innerHeight - 65.09;
      this.sideBar.style.height = height + 'px';
    });
  }

  logout() {
    this.auth.logout()
    .subscribe({
      next:(res)=>{
        this.cookie.delete('tokenProsumer','/');
        this.cookie.delete('refreshProsumer','/');
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
