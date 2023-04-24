import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';
import { data } from 'jquery';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-sidebar-potrosnja',
  templateUrl: './sidebar-potrosnja.component.html',
  styleUrls: ['./sidebar-potrosnja.component.css'],
})
export class SidebarPotrosnjaComponent {
  @ViewChild('sidebarInfo', { static: true }) sidebarInfo!: SidebarDsoComponent;
  constructor(
    private user: UsersServiceService,
    private router: ActivatedRoute,
    private deviceService: DeviceserviceService
  ) {}

  consumption: number = 0;
  production: number = 0;

  ngOnInit(): void {
    this.deviceService
      .getUserProductionAndConsumption(this.router.snapshot.params['id'])
      .subscribe((data) => {
        this.consumption = data.consumption;
        this.production = data.production;
      });

    //this.user.getRegionById(this.myData.regionId).subscribe((data)=> {
    //this.Region=data;

    //})
  }
}
