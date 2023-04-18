import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role';
import { DataService } from 'src/app/services/data.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  role: number=0;
  roles : Role[] = [];
  dropDownRole: boolean = false;

  constructor(private employeeService : EmployeesServiceService,private serviceData:DataService) {}

  ngOnInit(): void {
    this.employeeService.role = this.role;
    this.dropDownRole = false;
  }

  ChangeRole(e:any)
  {
    //console.log(this.role);
    this.employeeService.role = this.role;
  }

  getRoles()
  {
    this.serviceData.getAllRoles()
    .subscribe({
      next:(response)=>{
        this.roles = response;
        this.dropDownRole = true;
      },
      error:(err)=>
      {
        console.log(err.error);
      }
    });
  }

}
