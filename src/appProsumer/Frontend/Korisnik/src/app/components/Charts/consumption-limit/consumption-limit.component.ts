import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-consumption-limit',
  templateUrl: './consumption-limit.component.html',
  styleUrls: ['./consumption-limit.component.css'],
})
export class ConsumptionLimitComponent implements OnInit, AfterViewInit {
  loaded: boolean = false;
  width: number = 250;
  height : number = 260;
  thickness: number = 45;

  consumption: number = 0;
  showConsumptio: boolean = true;
  production: number = 0;
  showProduction: boolean = false;
  data: number = 0;

  markersConsumption = {
    '0': { color: 'black', label: '0' },
    '350': { color: 'black', label: '350' },
    '1600': { color: 'black', label: '1600' },
  };
  markersProduction = {
    '0': { color: 'black', label: '0' },
    '500': { color: 'black', label: '500' },
    '1000': { color: 'black', label: '1000' },
    '1500': { color: 'black', label: '1500' },
  };

  thresholdsConsumption = {
    '0': { color: 'green', bgOpacity: 0.2 },
    '350': { color: '#2a96d9', bgOpacity: 0.2 },
    '1600': { color: '#c14b48', bgOpacity: 0.2 },
  };
  thresholdsProduction = { '0': { color: 'green', bgOpacity: 0.2 } };

  gaugeLabel = 'Consumption';

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  constructor(
    private deviceService: DevicesService,
    private widthService: DeviceWidthService,
    private spiner: NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    this.ajustHeight();
  }

  ngOnInit(): void {
    this.showConsumptio = true;
    this.showProduction = false;
    this.loaded = false;
    this.width =
      document.getElementById('consumptionLimitCardBody')!.offsetWidth * 0.9;
    this.getConumptionAndProductionLimit();
    
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.ajustHeightOnWidthChange();
    });
  }

  getConumptionAndProductionLimit() {
    this.deviceService.getConsumptionAndProductionLimit().subscribe({
      next: (res) => {
        this.loaded = true;
        this.consumption = res.consumption.toFixed(1);
        this.production = res.production.toFixed(1);
        this.Consumption();
      },
      error: (err) => {
        this.loaded = false;
        console.log(err.error);
      },
    });
  }

  Consumption() {
    this.showConsumptio = true;
    this.showProduction = false;
    this.data = this.consumption;
    this.gaugeLabel = 'Consumption';
  }

  Production() {
    this.showConsumptio = false;
    this.showProduction = true;
    this.data = this.production;
    this.gaugeLabel = 'Production';
  }

  onRadioButtonChange(event: any, type: string) {
    this.ajustHeight();
    if (type === 'consumption') {
      this.showConsumptio = event.target.checked;
      if (this.showConsumptio) {
        this.Consumption();
      } else {
        this.Production();
      }
    } else if (type === 'production') {
      this.showProduction = event.target.checked;
      if (this.showProduction) {
        this.Production();
      } else {
        this.Consumption();
      }
    }
  }

  ajustHeight() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w >= 576) {
      this.height = h * 0.5;
    } else {
      if (this.widthService.height >= this.widthService.deviceWidth * 2) {
        
        this.height = h * 0.35;
      } else {
        this.height = h * 0.4;
      }
    }
    if(this.width>this.height)
    {
      this.height = this.width + 10;
    }
    document.getElementById('consumptionLimitBody')!.style.height = this.height + 'px';
  }

  ajustHeightOnWidthChange() {
    let w = this.widthService.deviceWidth;
    let h = this.widthService.height;
    this.width =
        document.getElementById('consumptionLimitCardBody')!.offsetWidth * 0.9;
    if (w >= 576) {
      this.height = h * 0.5;
    } else {
      if (this.widthService.height >= this.widthService.deviceWidth * 2) {
        
        this.height = h * 0.35;
      } else {
        this.height = h * 0.4;
      }
    }
    if(this.width>this.height)
    {
      this.height = this.width + 10;
    }
  }
}
