import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-worker-profile',
  templateUrl: './worker-profile.component.html',
  styleUrls: ['./worker-profile.component.css']
})
export class WorkerProfileComponent implements OnInit {

  worker : any;
  role : string = '';
  region : string = '';

  constructor(private workerService : EmployeesServiceService, private cookie : CookieService, private toast : NgToastService) {}

  ngOnInit(): void {
    this.getInfo();
    if(this.cookie.get('role')=="Dso"){
      this.role = "Admin";
    }
    else if(this.cookie.get('role')=="WorkerDso")
    {
      this.role = "Employee"
    }
  }

  private getInfo()
  {
    let id = this.cookie.get('id');

    this.workerService.detailsEmployee(id)
    .subscribe({
      next:(res)=>{
        this.worker = res;
        this.workerService.getRegionName(this.worker.regionId)
        .subscribe({
          next:(res)=>{
            this.region = res;
            //console.log(this.region);
          }
        })
        //console.log(this.worker);
      },
      error:(err)=>{
        console.log(err.error);
        this.toast.error({detail:"ERROR", summary:"Unable to get information", duration:3000});
      }
    })
  }
}
