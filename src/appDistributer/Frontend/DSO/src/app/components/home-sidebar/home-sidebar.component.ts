import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.css']
})
export class HomeSidebarComponent implements OnInit{

  region : string = '';
  currConsumption : string = '';
  currProduction : string = '';
  numOfUsers : string = '';

  constructor(private deviceService : DeviceserviceService, private employeeService : EmployeesServiceService, private toast : NgToastService) {}

  ngOnInit(): void {
    this.getRegion();
    this.getConsumptionProduction();
  }

  private getConsumptionProduction()
  {
    this.deviceService.getCurrConsumptionAndProduction()
    .subscribe({
      next:(res)=>{
        this.currConsumption = res.totalConsumption;
        this.currProduction = res.totalProduction;
      },
      error:(err)=>{
        console.log(err.error);
        this.toast.error({detail:"ERROR", summary:"Unable to load current consumption and production",duration:3000});
      }
    })
  }

  private getProsumerCount()
  {
    this.employeeService.getProsumerCout()
    .subscribe({
      next:(res)=>{
        this.numOfUsers = res.prosumerCount;
      },
      error:(err)=>{
        console.log(err.error);
        this.toast.error({detail:"ERROR", summary:"Unable to load user count",duration:3000});
      }
    })
  }

  private getRegion()
  {
    this.employeeService.getAllRegions()
    .subscribe({
      next:(res)=>{
        this.region = res[0].regionName;
        this.getProsumerCount();
      },
      error:(err)=>{
        console.log(err.error);
        this.toast.error({detail:"ERROR", summary:"Unable to load region",duration:3000});
      }
    })
  }

}
