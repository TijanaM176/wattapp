import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css'],
})
export class NavBarComponent implements OnInit {
  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthServiceService,
    private toast: NgToastService
  ) {}

  ngOnInit() {}

  LogOut() {
    this.cookie.delete('token');
    this.router.navigate(['login']);
  }
}
