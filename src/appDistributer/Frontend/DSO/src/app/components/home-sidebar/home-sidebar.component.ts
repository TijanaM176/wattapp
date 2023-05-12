import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { NgToastService } from 'ng-angular-popup';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ToastrService } from 'ngx-toastr';
import { DashboarddataService } from 'src/app/services/dashboarddata.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.css'],
})
export class HomeSidebarComponent implements OnInit, AfterViewInit {
  production = false;
  consumption = true;
  colorScheme: any = {
    domain: ['#FF414E', '#80BC00', '#C7B42C'],
  };
  data: any = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  region: string = '';
  currConsumption: string = '';
  currProduction: string = '';
  numOfUsers: string = '';
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  side: any;
  content: any;

  constructor(
    private deviceService: DeviceserviceService,
    private employeeService: EmployeesServiceService,
    private widthService: ScreenWidthService,
    private service: UsersServiceService,
    public toast: ToastrService,
    private servicedash: DashboarddataService,
    private servicedata: DataService
  ) {}

  ngAfterViewInit(): void {
    this.side.style.height = this.widthService.height + 'px';
    this.content.style.height = this.widthService.height + 'px';
  }

  ngOnInit(): void {
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('container')!.style.height = h + 'px';
    this.servicedash.ConsumerProducerRatio().subscribe((response) => {
      this.data = Object.entries(response).map(([name, value]) => ({
        name,
        value,
      }));
    });
    this.side = document.getElementById('sadrzaj');
    this.content = document.getElementById('container');

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.side.style.height = this.widthService.height + 'px';
      this.content.style.height = this.widthService.height + 'px';
    });
    this.getProsumerCount();
    this.getConsumptionProduction();
  }

  private getConsumptionProduction() {
    this.deviceService.getCurrConsumptionAndProduction().subscribe({
      next: (res) => {
        this.currConsumption = res.totalConsumption;
        this.currProduction = res.totalProduction;
      },
      error: (err) => {
        console.log(err.error);
        this.toast.error('Error!', 'Unable to load data.', {
          timeOut: 2500,
        });
      },
    });
  }

  private getProsumerCount() {
    this.servicedash.getProsumerCout().subscribe({
      next: (res) => {
        this.numOfUsers = res.prosumerCount;
      },
      error: (err) => {
        console.log(err.error);
        this.toast.error('Error!', 'Unable to load data.', {
          timeOut: 2500,
        });
      },
    });
  }
}
