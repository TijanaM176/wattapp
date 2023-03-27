import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  role: number=0;
  roles : Role[] = [];
  dropDownRole: string = '';

  constructor(private employeeService : EmployeesServiceService) {}

  ngOnInit(): void {
    this.employeeService.role = this.role;
    this.employeeService.getAllRoles()
    .subscribe((response) => {
      //console.log(response);
      this.roles = response;
      //console.log(this.roles)
    });
  }

  ChangeRole(e:any)
  {
    //console.log(this.role);
    this.employeeService.role = this.role;
  }

}
