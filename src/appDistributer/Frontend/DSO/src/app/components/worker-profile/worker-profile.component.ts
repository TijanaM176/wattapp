import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-worker-profile',
  templateUrl: './worker-profile.component.html',
  styleUrls: ['./worker-profile.component.css']
})
export class WorkerProfileComponent implements OnInit, AfterViewInit {

  worker : any;
  side : any;
  sadrzaj : any;
  loader:boolean=true;
  resizeObservable$!: Observable<Event>
  resizeSubscription$!: Subscription;

  role : string = '';
  region : string = '';

  constructor(private workerService : EmployeesServiceService, private cookie : CookieService, private toast : NgToastService, private widthService : ScreenWidthService) {}

  ngAfterViewInit(): void {
    this.sadrzaj.style.height = this.widthService.height+'px';
    this.side.style.height = this.widthService.height+'px';
  }

  ngOnInit(): void {
    this.sadrzaj = document.getElementById('sadrzaj');
    this.side = document.getElementById('side');
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.sadrzaj.style.height = this.widthService.height+'px';
      this.side.style.height = this.widthService.height+'px';
    })
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
