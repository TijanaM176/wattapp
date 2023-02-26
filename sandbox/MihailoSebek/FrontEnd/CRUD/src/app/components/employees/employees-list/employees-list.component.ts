import { Component } from '@angular/core';
import { Employee } from 'src/app/models/Employee';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent {
  employees: Employee[] = [];
  constructor() {}

  ngOnIniT(): void {}
}
