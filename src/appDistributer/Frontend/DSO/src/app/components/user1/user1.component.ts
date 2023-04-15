import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';
import { data } from 'jquery';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';

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
  myData: any;
  Region: any;
  city : any;

  ngOnInit(): void {
    this.spiner.show();
    this.user
      .detailsEmployee(this.router.snapshot.params['id'])
      .subscribe((data) => {
        console.log(data);
        this.myData = data;
        this.id = this.router.snapshot.params['id'];
        this.Region = this.cookie.get('region');
        this.user.getCityNameById(this.myData.cityId).subscribe((dat) => {
          this.city = dat;
        });
      });
  }
}
