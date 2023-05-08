import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { EmployeesComponent } from '../employees/employees.component';

@Component({
  selector: 'app-employeedetails',
  templateUrl: './employeedetails.component.html',
  styleUrls: ['./employeedetails.component.css'],
})
export class EmployeedetailsComponent implements OnInit {
  @Input() showDetails: boolean=false;

  constructor(private spiner: NgxSpinnerService) {
    
  }
  
  ngOnInit() {
    this.spiner.show();
    
  }
}
