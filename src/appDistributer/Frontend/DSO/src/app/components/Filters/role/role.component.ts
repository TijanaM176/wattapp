import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  role!: number;
  roles : Role[] = [];
  dropDownRole: string = '';

  constructor(private employeeService : EmployeesServiceService) {}

  ngOnInit(): void {
    this.employeeService.getAllRoles()
    .subscribe((response) => {
      this.roles = response;
    });
  }

  ChangeRole(e:any)
  {
    this.employeeService.role = this.role;
  }

}
