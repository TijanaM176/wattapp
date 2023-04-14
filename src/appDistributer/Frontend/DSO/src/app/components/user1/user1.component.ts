import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';
import { data } from 'jquery';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private spiner: NgxSpinnerService
  ) {}

  id: string = '';
  myData: any;
  Region: any;

  ngOnInit(): void {
    this.spiner.show();
    this.user
      .detailsEmployee(this.router.snapshot.params['id'])
      .subscribe((data) => {
        console.log(data);
        this.myData = data;
        this.id = this.router.snapshot.params['id'];

        this.user1.getRegionName(this.myData.regionId).subscribe((dat) => {
          this.Region = dat;
        });
      });
  }
}
