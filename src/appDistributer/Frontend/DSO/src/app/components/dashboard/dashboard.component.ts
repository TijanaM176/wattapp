import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router, private cookie: CookieService) {
    
  }
  LogOut()
  {
    this.cookie.delete("token");
    this.router.navigate(["login"]);
  }
}
