// import { NgToastService } from 'ng-angular-popup';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { DataService } from 'src/app/services/data.service';
import { WorkerChangePasswordDto } from 'src/app/models/workerChangePasswordDto';
import { editEmployeeDto } from 'src/app/models/editEmployee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-worker-profile',
  templateUrl: './worker-profile.component.html',
  styleUrls: ['./worker-profile.component.css'],
})
export class WorkerProfileComponent implements OnInit, AfterViewInit {
  worker: any;
  side: any;
  sadrzaj: any;
  loader: boolean = true;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  role: string = '';
  region: string = '';
  startedWorking : string = '';

  currentPass : string =''
  newPass : string = ''
  confirmNewPass : string = ''

  failure : boolean = false;
  success : boolean = false;
  dontMatch : boolean = false;
  incorrectCurrent : boolean = false;
  empty : boolean = false;

  constructor(
    private workerService: EmployeesServiceService,
    private router: Router,
    private cookie: CookieService,
    public toast: ToastrService,
    private widthService: ScreenWidthService,
    private employeeService : EmployeesServiceService
  ) {}

  ngAfterViewInit(): void {
    // this.sadrzaj.style.height = this.widthService.height * 0.6 + 'px';
    this.side.style.height = this.widthService.height * 0.65 + 'px';
  }

  ngOnInit(): void {
    this.sadrzaj = document.getElementById('sadrzaj');
    this.side = document.getElementById('side');
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      // this.sadrzaj.style.height = this.widthService.height * 0.6 + 'px';
      this.side.style.height = this.widthService.height * 0.65 + 'px';
    });
    this.getInfo();
    if (this.cookie.get('role') == 'Dso') {
      this.role = 'Admin';
    } else if (this.cookie.get('role') == 'WorkerDso') {
      this.role = 'Employee';
    }
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }

  private getInfo() {
    let id = this.cookie.get('id');

    this.workerService.detailsEmployee(id).subscribe({
      next: (res) => {
        this.worker = res;
        let date = new Date(this.worker.prosumerCreationDate);
        this.startedWorking = date.getDay() + '. ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear() + '.';
        this.region = this.cookie.get('region');
      },
      error: (err) => {
        console.log(err.error);
        this.toast.error('Error!', 'Unable to get Region Name.', {
          timeOut: 2500,
        });
      },
    });
  }

  OpenChangePassword()
  {
    document.getElementById('openChangePasswordWorkerPRofile')!.click();
  }
  closeChangePAss()
  {
    document.getElementById('openWorkerProfileAgain')!.click()
  }
  confirmNewPassword()
  {
    if(this.newPass =="" || this.confirmNewPass =="" || this.currentPass=="") // || this.currentPass==""
    {
      this.allToFalse();
      this.empty = true;
    }
    else if(this.newPass != this.confirmNewPass)
    {
      this.allToFalse();
      this.dontMatch = true;
    }
    else
    {
      let dto : editEmployeeDto = new editEmployeeDto();
      dto.password = this.newPass;
      // dto.newPassword = this.newPass;
      // dto.oldPassword = this.currentPass;
      this.employeeService.updateEmployee(this.cookie.get('id'), dto)
      .subscribe({
        next:(res)=>{
          this.allToFalse();
          this.success = true;
          setTimeout(()=>{
            document.getElementById('closeChangePassOnSuccess')!.click();
            this.cookie.deleteAll('/');
            this.router.navigate(['login']);
          },700)
        },
        error:(err)=>{
          console.log(err.error);
        }
      })
    }
  }
  private allToFalse()
  {
    this.failure = false;
    this.success = false;
    this.dontMatch = false;
    this.incorrectCurrent = false;
    this.empty = false;
  }
}
