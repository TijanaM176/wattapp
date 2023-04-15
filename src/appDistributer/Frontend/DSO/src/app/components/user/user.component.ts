import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';
import { editUserDto } from 'src/app/models/editUserDto';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @ViewChild('sidebarInfo', { static: true }) sidebarInfo!: SidebarDsoComponent;
  constructor(
    private user: UsersServiceService,
    private router: ActivatedRoute,
    private spiner: NgxSpinnerService
  ) {}
  id: string = '';
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
    this.id = this.router.snapshot.params['id'];
    //console.log(this.router.snapshot.params['id'] );
    this.user
      .detailsEmployee(this.router.snapshot.params['id'])
      .subscribe((res: any) => {
        this.userOldInfo = res;
        this.sidebarInfo.populate(res['username'], res['address']);
        this.editUser = new FormGroup({
          FirstName: new FormControl(res['firstName']),
          LastName: new FormControl(res['lastName']),
          Username: new FormControl(res['username']),
          Email: new FormControl(res['email']),
          Address: new FormControl(res['address']),
          NeigborhoodName: new FormControl(res['regionId']),
          Latitude: new FormControl(''),
          Longitude: new FormControl(''),
          CityName: new FormControl(''),
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
