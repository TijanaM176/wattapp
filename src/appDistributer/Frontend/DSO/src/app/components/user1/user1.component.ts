import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';
import { data } from 'jquery';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-user1',
  templateUrl: './user1.component.html',
  styleUrls: ['./user1.component.css'],
})
export class User1Component implements OnInit, AfterViewInit {
  @ViewChild('sidebarInfo', { static: true }) sidebarInfo!: SidebarDsoComponent;
  loader: boolean = true;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  constructor(
    private user1: EmployeesServiceService,
    private user: UsersServiceService,
    private router: ActivatedRoute,
    private employyeService: EmployeesServiceService,
    private spiner: NgxSpinnerService,
    private cookie : CookieService,
    private widthService : ScreenWidthService
  ) {}

  id: string = '';
  firstName : string = '';
  lastName : string = '';
  username : string = '';
  email : string = '';
  address : string = '';
  Region: string = '';
  city : string = '';

  ngOnInit(): void {
    document.getElementById('sidebarPotrosnjaContainer')!.style.height = this.widthService.height+'px';
    document.getElementById('userInfoDataContainer')!.style.height = this.widthService.height+'px';
    this.spiner.show();
    this.user
      .detailsEmployee(this.router.snapshot.params['id'])
      .subscribe((data) => {
        console.log(data);
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.username = data.username;
        this.email = data. email;
        this.address = data.address;
        this.id = this.router.snapshot.params['id'];
        this.Region = this.cookie.get('region');
        this.user.getCityNameById(data.cityId).subscribe((dat) => {
          this.city = dat;
        });
      });

      this.resizeObservable$ = fromEvent(window, 'resize');
      this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
        document.getElementById('sidebarPotrosnjaContainer')!.style.height = this.widthService.height+'px';
        document.getElementById('userInfoDataContainer')!.style.height = this.widthService.height+'px';
      })
  }

  ngAfterViewInit(): void {
    document.getElementById('sidebarPotrosnjaContainer')!.style.height = this.widthService.height+'px';
    document.getElementById('userInfoDataContainer')!.style.height = this.widthService.height+'px';
  }
}
