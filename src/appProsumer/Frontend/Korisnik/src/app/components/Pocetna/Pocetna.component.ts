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
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

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
  
  @ViewChild('devicesStatus', { static: true })
  devicesStatus!: DevicesStatusComponent;

  @ViewChild('realizationConsumption', { static: true })
  realizationConsumption!: RealizationChartComponent;

  @ViewChild('realizationProduction', { static: true })
  realizationProduction!: RealizationChartProductionComponent;

  currentPrice: number = 0;
  currentConsumption: number = 0;
  currentProduction: number = 0;

  show1!: boolean;
  show2!: boolean;

  constructor(
    private widthService: DeviceWidthService,
    private service: ProsumerService,
    private cookie: CookieService,
    private dashboardService: DashboardService,
    private deviceService: DevicesService,
    private location: Location,
    private spiner: NgxSpinnerService
  ) {
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.getDevices();
    this.getPrice();
    let hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      this.tariff = 'LOWER';
    } else {
      this.tariff = 'HIGHER';
    }
    this.activateBtn('offcanvasHome');
    this.activateButton('sidebarHome');
  }

  getDevices() {
    let id = localStorage.getItem('idProsumer')!;
    let role = localStorage.getItem('roleProsumer')!;
    this.spiner.show();
    this.service
      .getDevicesByProsumerId(id, role)
      .subscribe((response) => {
        this.devices = [
          ...response.consumers,
          ...response.producers,
          ...response.storage,
        ];
        this.currentConsumption = response.currentConsumption;
        this.currentProduction = response.currentProduction;
        this.house.setDevices(this.devices);
        this.devicesStatus.setDevices(this.devices);
        this.devicesStatus.setCurrentConsumptionAndProduction(
          this.currentConsumption,
          this.currentProduction
        );
        this.numOfDevices = this.devices.length;
        this.devices.forEach((device) => {
          if (device.Activity != 0) {
            this.numOfActiveDevices += 1;
          }
        });
        this.spiner.hide();
        this.show1 = false;

        this.show2 = false;
      });
  }

  getPrice() {
    this.dashboardService.getCurrentElecticityPrice().subscribe({
      next: (res) => {
        this.currentPrice = res.Price;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  onDeviceTurnedOffOn(
    data: [any[], number, number, number ,string] //devices : any[], offOn : number
  ) {
    this.devices = data[0];
    let offOn = data[1];
    let activity = data[2];
    let last = data[3];
    let cat = data[4];
    if(cat !='3')
    {
      if (activity != 0) {
        //one of the devices has been turned on
        this.numOfActiveDevices += 1;
        cat == '1'
          ? (this.currentConsumption += offOn)
          : (this.currentProduction += offOn);
      } else if (activity == 0) {
        //one of the devices has been turned off
        this.numOfActiveDevices -= 1;
        cat == '1'
          ? (this.currentConsumption -= last)
          : (this.currentProduction -= last);
      }
    }
    else
    {
      activity!=0 ? this.numOfActiveDevices+=1 : this.numOfActiveDevices-=1;
    }
    this.devicesStatus.setDevices(this.devices);
    this.devicesStatus.setCurrentConsumptionAndProduction(
      this.currentConsumption,
      this.currentProduction
    );
  }

  activateBtn(id: string) {
    const buttons = document.querySelectorAll('.offcanvasBtn');
    buttons.forEach((button) => {
      if (button.id == id) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
  activateButton(id: string) {
    const buttons = document.querySelectorAll('.sidebarBtn');
    buttons.forEach((button) => {
      if (button.id == id) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
