import { Component } from '@angular/core';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-employee-nav-bar',
  templateUrl: './employee-nav-bar.component.html',
  styleUrls: ['./employee-nav-bar.component.css']
})
export class EmployeeNavBarComponent {

  constructor(private employeeService : EmployeesServiceService) {}

  getByFilet()
  {
    this.employeeService.getWorkersByFilter();
  }

  loadAll()
  {
    this.employeeService.getAllData();
  }

  
}
