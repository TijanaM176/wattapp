import { Component, ViewChild, OnInit } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { RegionComponent } from '../Filters/region/region.component';
import { RoleComponent } from '../Filters/role/role.component';

@Component({
  selector: 'app-employee-nav-bar',
  templateUrl: './employee-nav-bar.component.html',
  styleUrls: ['./employee-nav-bar.component.css']
})
export class EmployeeNavBarComponent implements OnInit{

  @ViewChild('region',{static: true}) region! : RegionComponent;
  @ViewChild('role',{static: true}) role! : RoleComponent;

  constructor(private employeeService : EmployeesServiceService) {}

  ngOnInit(): void {
    this.loadFilters();
  }

  getByFilet()
  {
    this.employeeService.filter();
  }

  loadAll()
  {
    this.region.region = "";
    this.role.role = 0;
    this.employeeService.getAllData();
  }

  loadFilters()
  {
    this.employeeService.getAllRegions()
    .subscribe({
      next:(response)=>{
        this.region.regions = response;
        this.employeeService.getAllRoles()
        .subscribe({
          next:(response)=>{
            this.role.roles = response;
          },
          error:(err)=>
          {
            console.log(err.error);
          }
        });
      },
      error:(err)=>
      {
        console.log(err.error);
      }
    });
  }
}
