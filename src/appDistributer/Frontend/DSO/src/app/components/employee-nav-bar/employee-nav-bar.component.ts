import { Component, ViewChild, OnInit } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { RegionComponent } from '../Filters/region/region.component';
import { RoleComponent } from '../Filters/role/role.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-employee-nav-bar',
  templateUrl: './employee-nav-bar.component.html',
  styleUrls: ['./employee-nav-bar.component.css']
})
export class EmployeeNavBarComponent implements OnInit{

  @ViewChild('region',{static: true}) region! : RegionComponent;
  @ViewChild('role',{static: true}) role! : RoleComponent;

  constructor(private employeeService : EmployeesServiceService,private serviceData:DataService) {}

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
    this.serviceData.getAllRegions()
    .subscribe({
      next:(response)=>{
        this.region.regions = response;
        this.serviceData.getAllRoles()
        .subscribe({
          next:(response)=>{
            let index = response.findIndex(x=> x.roleName=='Prosumer');
            response.splice(index,1);
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
