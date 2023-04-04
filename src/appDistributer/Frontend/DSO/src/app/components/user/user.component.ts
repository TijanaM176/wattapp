import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @ViewChild('sidebarInfo', { static: true }) sidebarInfo!: SidebarDsoComponent;
  constructor(
    private user: UsersServiceService,
    private router: ActivatedRoute
  ) {}
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

  ngOnInit(): void {
    //console.log(this.router.snapshot.params['id'] );
    this.user
      .detailsEmployee(this.router.snapshot.params['id'])
      .subscribe((res: any) => {
        this.sidebarInfo.populate(res['username'], res['address']);
        this.editUser = new FormGroup({
          FirstName: new FormControl(res['firstNdame']),
          LastName: new FormControl(res['lastName']),
          Username: new FormControl(res['username']),
          Email: new FormControl(res['email']),
          Address: new FormControl(res['address']),
          NeigborhoodName: new FormControl(res['neigborhoodId']),
          Latitude:new FormControl(''),
          Longitude:new FormControl(''),
          CityName:new FormControl(''),
        });
      });
  }
  UpdateData() {
    this.user
      .updateUserData(this.router.snapshot.params['id'], this.editUser.value)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
