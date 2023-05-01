import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ProsumerService } from 'src/app/services/prosumer.service';
import { CookieService } from 'ngx-cookie-service';
import { HouseComponent } from '../Charts/house/house.component';
import { DevicesStatusComponent } from '../Charts/devices-status/devices-status.component';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DevicesService } from 'src/app/services/devices.service';
import { RealizationChartComponent } from '../Charts/realization-chart/realization-chart.component';
import { RealizationChartProductionComponent } from '../Charts/realization-chart-production/realization-chart-production.component';

@Component({
  selector: 'app-Pocetna',
  templateUrl: './Pocetna.component.html',
  styleUrls: ['./Pocetna.component.css'],
})
export class PocetnaComponent implements OnInit, AfterViewInit {
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  loader: boolean = true;

  devices: any[] = [];
  numOfDevices: number = 0;
  numOfActiveDevices: number = 0;

  tariff: string = 'HIGHER';

  @ViewChild('house', { static: true }) house!: HouseComponent;
  @ViewChild('devicesStatus', { static: true }) devicesStatus!: DevicesStatusComponent;
  @ViewChild('realizationConsumption',{static:true}) realizationConsumption! : RealizationChartComponent;
  @ViewChild('realizationProduction',{static: true}) realizationProduction! : RealizationChartProductionComponent;

  currentPrice : number = 0;
  currentConsumption : number = 0;
  currentProduction : number = 0;

  constructor(
    private widthService: DeviceWidthService,
    private service: ProsumerService,
    private cookie: CookieService,
    private dashboardService : DashboardService,
    private deviceService : DevicesService
  ) {}

  ngAfterViewInit(): void {
    // const homeCont = document.getElementById('homeCont');
    // homeCont!.style.height = this.widthService.height + 'px';
  }

  ngOnInit() {
    setTimeout(() => {
      this.loader = false;
    }, 2000);
    this.getDevices();
    this.getPrice()
    this.get7DaysHistory();
    let hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      this.tariff = 'LOWER';
    } else {
      this.tariff = 'HIGHER';
    }
  }

  getDevices() {
    this.service
      .getDevicesByProsumerId(this.cookie.get('id'), this.cookie.get('role'))
      .subscribe((response) => {
        this.devices = [
          ...response.consumers,
          ...response.producers,
          ...response.storage,
        ];
        // console.log(this.devices);
        this.currentConsumption = response.currentConsumption;
        this.currentProduction = response.currentProduction;
        this.house.setDevices(this.devices);
        this.devicesStatus.setDevices(this.devices);
        this.devicesStatus.setCurrentConsumptionAndProduction(this.currentConsumption,this.currentProduction);
        this.numOfDevices = this.devices.length;
        this.devices.forEach((device) => {
          if(device.CurrentUsage!=0)
          {
            this.numOfActiveDevices +=1;
          }
        });
      });
  }

  getPrice()
  {
    this.dashboardService.getCurrentElecticityPrice()
    .subscribe({
      next:(res)=>{
        this.currentPrice = res.Price;
      },
      error:(err)=>{
        console.log(err.error);
      }
    })
  }

  get7DaysHistory()
  {
    this.deviceService.history7Days()
    .subscribe({
      next:(res)=>{
        // console.log(res);
        this.realizationConsumption.HistoryWeekInit(res);
        this.realizationProduction.HistoryWeekInit(res);
      }
    })
  }

  onDeviceTurnedOffOn(data:[any[],number, number,string]) //devices : any[], offOn : number
  {
    let offOn = data[1];
    this.devices = data[0];
    let last = data[2];
    let cat = data[3];
    if(offOn != 0) //one of the devices has been turned on
    {
      this.numOfActiveDevices+=1;
      cat=='1'? this.currentConsumption += offOn : this.currentProduction += offOn;
    }
    else if(offOn==0)//one of the devices has been turned off
    {
      this.numOfActiveDevices-=1;
      cat=='1'? this.currentConsumption -= last : this.currentProduction -= last;
    }
    this.devicesStatus.setDevices(this.devices);
    this.devicesStatus.setCurrentConsumptionAndProduction(this.currentConsumption,this.currentProduction);
  }
}
