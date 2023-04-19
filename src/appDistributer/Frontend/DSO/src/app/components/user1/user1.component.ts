import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';
import { data } from 'jquery';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { editUserDto } from 'src/app/models/editUserDto';

@Component({
  selector: 'app-user1',
  templateUrl: './user1.component.html',
  styleUrls: ['./user1.component.css'],
})
export class User1Component {
  @ViewChild('sidebarInfo', { static: true }) sidebarInfo!: SidebarDsoComponent;
  loader: boolean = true;
  constructor(
    private user1: EmployeesServiceService,
    private user: UsersServiceService,
    private router: ActivatedRoute,
    private employyeService: EmployeesServiceService,
    private spiner: NgxSpinnerService,
    private cookie : CookieService
  ) {}

  id: string = '';
  firstName : string = '';
  lastName : string = '';
  username : string = '';
  email : string = '';
  address : string = '';
  Region: string = '';
  city : string = '';
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
    this.spiner.show();
    this.user
      .detailsEmployee(this.router.snapshot.params['id'])
      .subscribe((data: any) => {
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
      console.log(res);
    });
  }
}
