import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  users: any;
  showModal: boolean = false;
  currentCountry:string = '';

  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthServiceService,
    private toast: NgToastService
  ) {}

  ngAfterViewInit(): void {
    this.getState();
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.showModal = false;
  }

  LogOut() {
    this.cookie.deleteAll();
    this.router.navigate(['login']);
  }

  getAllUsers() {
    this.auth.getUsers().subscribe({
      next: (res) => {
        //console.log(res);
        this.users = res;
      },
      error: (err) => {
        //alert(err.error.message);
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 3000,
        });
      },
    });
  }

  getState()
  {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.cookie.set('lat', position.coords.latitude.toString());
          this.cookie.set('long', position.coords.longitude.toString());
          var url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
          fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log(data.address.country);
            this.cookie.set('country',data.address.country);
          })
        },
        (error) => {
          // If the user denies permission or an error occurs, handle it appropriately
          console.error("Error getting user's location:", error);
          this.showModal = true;
          this.toast.error({
            detail: 'ERROR',
            summary: 'Unable To Get Your Current Location.',
            duration: 3000,
          });
        },{ enableHighAccuracy: true, timeout: 100 }
      )
    }
    else {
      // If the browser does not support the Geolocation API, handle it appropriately
      this.showModal = true;
      this.toast.error({
        detail: 'ERROR',
        summary: 'Geolocation is not supported by this browser.',
        duration: 3000,
      });
    }
  }

  SaveCountry()
  {
    if(this.currentCountry!="")
    {
      this.cookie.set('country',this.currentCountry);
      this.showModal = false;
    }
  }
}
