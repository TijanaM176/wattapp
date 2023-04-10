import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css'],
})
export class NavBarComponent implements OnInit {
  value: string = '';
  
  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthServiceService,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.value = this.cookie.get('role');
  }

  LogOut() {
    this.cookie.delete('token','/');
    this.cookie.delete('refresh','/');
    this.cookie.delete('id','/');
    this.cookie.delete('role','/');
    this.cookie.delete('username','/');
    this.cookie.delete('lat','/');
    this.cookie.delete('long','/');
    this.cookie.delete('acc','/');
    this.cookie.delete('country','/');
    this.cookie.deleteAll();
    this.router.navigate(['login']);
  }
}
