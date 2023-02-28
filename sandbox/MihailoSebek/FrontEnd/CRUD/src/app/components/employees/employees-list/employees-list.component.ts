import { Component } from '@angular/core';
import { Employee } from 'src/app/models/Employee';
import { EmployeesService } from '../../../services/employees.service';
import {OnInit} from "@angular/core";

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit{
  employees: Employee[] = [];
  constructor(private employeeService: EmployeesService) {}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((response) => {
      this.employees = response;
      console.log(response);
    });
  }
}
