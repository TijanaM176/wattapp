import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-sidebar-responsive',
  templateUrl: './sidebar-responsive.component.html',
  styleUrls: ['./sidebar-responsive.component.css']
})
export class SidebarResponsiveComponent implements OnInit, AfterViewChecked{

  sideBar : any;

  constructor(private router: Router, private cookie: CookieService, private auth: AuthServiceService, private toast: NgToastService) {}
  
  ngAfterViewChecked(): void {
    this.sideBar = document.getElementById('sadrzaj');
    let height = window.innerHeight - 65.09;
    console.log(height);
    this.sideBar.style.height = height+'px';
  }

  ngOnInit(): void {
  }

  logout()
  {
    this.cookie.deleteAll();
    this.router.navigate(["login"]);
  }

  viewProfile()
  {
    
  }
}
