import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';
import { data } from 'jquery';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from 'src/app/services/data.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { editUserDto } from 'src/app/models/editUserDto';

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
    private cookie: CookieService,
    private serviceData: DataService,
    private widthService: ScreenWidthService,
    private r: Router
  ) {}
  letValue: string = '';
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  address: string = '';
  Region: string = '';
  city: string = '';
  editUser = new FormGroup({
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    Username: new FormControl(''),
    Email: new FormControl(''),
    Address: new FormControl(''),
    NeigborhoodName: new FormControl(''),
    Latitude: new FormControl(''),
    Longitude: new FormControl(''),
    CityName: new FormControl(''),
  });
  message: boolean = false;
  userOldInfo: any;

  ngOnInit(): void {
    document.getElementById('sidebarPotrosnjaContainer')!.style.height =
      this.widthService.height + 'px';
    document.getElementById('userInfoDataContainer')!.style.height =
      this.widthService.height + 'px';
    this.letValue = this.cookie.get('role');
    this.spiner.show();
    this.user
      .detailsEmployee(this.router.snapshot.params['id'])
      .subscribe((data: any) => {
        // console.log(data);
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.username = data.username;
        this.email = data.email;
        this.address = data.address;
        this.id = this.router.snapshot.params['id'];
        this.Region = this.cookie.get('region');
        this.serviceData.getCityNameById(data.cityId).subscribe((dat) => {
          // console.log(dat)
          this.city = dat;
          this.userOldInfo = data;
          this.editUser = new FormGroup({
            FirstName: new FormControl(data['firstName']),
            LastName: new FormControl(data['lastName']),
            Username: new FormControl(data['username']),
            Email: new FormControl(data['email']),
            Address: new FormControl(data['address']),
            NeigborhoodName: new FormControl(data['regionId']),
            Latitude: new FormControl(''),
            Longitude: new FormControl(''),
            CityName: new FormControl(''),
          });
        });
      });

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      document.getElementById('sidebarPotrosnjaContainer')!.style.height =
        this.widthService.height + 'px';
      document.getElementById('userInfoDataContainer')!.style.height =
        this.widthService.height + 'px';
    });
  }

  ngAfterViewInit(): void {
    document.getElementById('sidebarPotrosnjaContainer')!.style.height =
      this.widthService.height + 'px';
    document.getElementById('userInfoDataContainer')!.style.height =
      this.widthService.height + 'px';
  }
  UpdateData() {
    let dto: editUserDto = new editUserDto();
    dto.id = this.router.snapshot.params['id'];
    dto.firstName = this.editUser.value.FirstName!;
    dto.lastName = this.editUser.value.LastName!;
    if (this.userOldInfo.email != this.editUser.value.Email) {
      dto.email = this.editUser.value.Email!;
    }
    this.user.updateUserData(dto.id, dto).subscribe((res) => {
      // console.log(res);
      window.location.reload;
    });
    
  }

  DeleteUser() {
    //console.log(this.router.snapshot.params['id']);
    this.user.deleteUser(this.router.snapshot.params['id']).subscribe({
      next: (res) => {
        // console.log(res);
        this.r.navigate(['/DsoApp/users']);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }
}
