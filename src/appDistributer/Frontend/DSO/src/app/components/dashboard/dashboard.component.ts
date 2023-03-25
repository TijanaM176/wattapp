import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users: any;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthServiceService,
    private toast: NgToastService
  ) {}
  ngOnInit(): void {
    this.getState();
  }

  getState()
  {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
        },
        (error) => {
          // If the user denies permission or an error occurs, handle it appropriately
          console.error("Error getting user's location:", error);
          this.toast.error({
            detail: 'ERROR',
            summary: 'Unable To Get Your Current Location.',
            duration: 3000,
          });
        },
        { enableHighAccuracy: true, timeout: 100 }
      )
    }
    else {
      // If the browser does not support the Geolocation API, handle it appropriately
      this.toast.error({
        detail: 'ERROR',
        summary: 'Geolocation is not supported by this browser.',
        duration: 3000,
      });
    }
  }
}
