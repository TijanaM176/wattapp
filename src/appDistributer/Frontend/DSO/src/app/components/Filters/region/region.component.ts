import { Component, OnInit } from '@angular/core';
import { Region } from 'src/app/models/region';
import { DataService } from 'src/app/services/data.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  region: string = '';
  regions : Region[] = [];
  dropDownRegion: boolean = false;

  constructor(private employeeService : EmployeesServiceService,private serviceData:DataService) {}

  ngOnInit(): void {
    this.dropDownRegion = false;
  }
  ChangeRegion(e: any)
  {
    this.employeeService.region = this.region;
  }

  getRegions()
  {
    this.serviceData.getAllRegions()
    .subscribe({
      next:(response)=>{
        this.regions = response;
        this.dropDownRegion = true;
      },
      error:(err)=>
      {
        console.log(err.error);
      }
    });
  }
}
