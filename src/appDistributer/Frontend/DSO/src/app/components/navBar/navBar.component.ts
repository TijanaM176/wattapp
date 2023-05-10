// import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { WorkerProfileComponent } from '../worker-profile/worker-profile.component';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css'],
})
export class NavBarComponent implements OnInit {
  value: string = '';
  url: string = '';
  letValue: string = '';
  currentImage:any;
  @ViewChild('WorkerProfile', {static : true}) WorkerProfile! : WorkerProfileComponent;

  constructor(private router: Router, private cookie: CookieService,private service:EmployeesServiceService) {}

  ngOnInit(): void {
    this.value = this.cookie.get('role');
    this.url = window.location.pathname;
    this.ChangeActive();
    this.letValue = this.cookie.get('role');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
        this.ChangeActive();
      }
    });
    this.service.detailsEmployee(this.cookie.get('id')).subscribe((res) => {
      this.Image(res.image);
    });
  }
  private Image(image : any)
  {
    this.currentImage = 'assets/images/employee-default-pfp.png';
    if(image != "" && image != null)
    {
      let byteArray = new Uint8Array(
        atob(image)
        .split('')
        .map((char)=> char.charCodeAt(0))
      );
      let file = new Blob([byteArray], {type: 'image/png'});
      this.currentImage = URL.createObjectURL(file);
    }
  }
  ChangeActive() {
    if (this.url === '/DsoApp/users') {
      document.getElementById('navbarDropdownUsers')?.classList.add('active');
      document.getElementById('home')?.classList.remove('active');
      document
        .getElementById('navbarDropdownEmployees')
        ?.classList.remove('active');
    } else if (this.url === '/DsoApp/home') {
      document
        .getElementById('navbarDropdownUsers')
        ?.classList.remove('active');
      document.getElementById('home')?.classList.add('active');
      document
        .getElementById('navbarDropdownEmployees')
        ?.classList.remove('active');
    } else if (this.url === '/DsoApp/employees') {
      document
        .getElementById('navbarDropdownUsers')
        ?.classList.remove('active');
      document.getElementById('home')?.classList.remove('active');
      document
        .getElementById('navbarDropdownEmployees')
        ?.classList.add('active');
    }
  }

  LogOut() {
    this.cookie.delete('token', '/');
    this.cookie.delete('refresh', '/');
    this.cookie.delete('id', '/');
    this.cookie.delete('role', '/');
    this.cookie.delete('username', '/');
    this.cookie.delete('lat', '/');
    this.cookie.delete('long', '/');
    this.cookie.delete('acc', '/');
    this.cookie.delete('country', '/');
    this.cookie.deleteAll();
    this.router.navigate(['login']);
  }
}
