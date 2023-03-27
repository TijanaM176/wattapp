import { Component, OnInit } from '@angular/core';
import { Region } from 'src/app/models/region';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  region: string = '';
  regions : Region[] = [];
  dropDownRegion: string = '';

  constructor(private employeeService : EmployeesServiceService) {}

  ngOnInit(): void {
    this.employeeService.getAllRegions()
    .subscribe((response) => {
      this.regions = response;
    });
  }


  ChangeRegion(e: any)
  {
    this.employeeService.region = this.region;
  }
}
