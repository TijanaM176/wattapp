import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Color,
  ColorHelper,
  LegendPosition,
  ScaleType,
} from '@swimlane/ngx-charts';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';

@Component({
  selector: 'app-realizationDevice',
  templateUrl: './realizationDevice.component.html',
  styleUrls: ['./realizationDevice.component.css'],
})
export class RealizationDeviceComponent implements OnInit, AfterViewInit {
  data: any[] = [];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#c14b48', 'rgb(219, 169, 30)'],
  };
  colors1: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#48bec1', '#80bc00'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kWh';
  idDev: string = '';
  cat: string = '';
  @Input() type : string = '';

  constructor(
    private deviceService: DevicesService,
    private widthService: DeviceWidthService,
    private router1: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    const grafik = document.getElementById('grafik');
    grafik!.style!.height = this.widthService.height * 0.6 + 'px';
    document.getElementById('realizDev1')!.classList.add('active');
  }

  ngOnInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    this.HistoryWeek('realizDev1');
  }

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  getWeek(date: Date): number {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(
      ((date.getTime() - oneJan.getTime()) / millisecsInDay +
        oneJan.getDay() +
        1) /
        7
    );
  }

  HistoryWeek(id: string) {
    this.loadData(
      this.deviceService.historyDeviceWeek.bind(this.deviceService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          this.activateButton(id);
          return { name: dayName, series: item.series };
        });
      }
    );
  }

  HistoryMonth(id: string) {
    this.loadData(
      this.deviceService.historyDeviceMonth.bind(
        this.deviceService,
        this.idDev
      ),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const weekNumber = this.getWeek(date);
          this.activateButton(id);
          return { name: `Week ${weekNumber}`, series: item.series };
        });
      }
    );
  }

  HistoryYear(id: string) {
    this.loadData(
      this.deviceService.historyDeviceYear.bind(this.deviceService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const monthName = date.toLocaleDateString('en-US', { month: 'long' });
          this.activateButton(id);
          return { name: monthName, series: item.series };
        });
      }
    );
  }

  loadData(apiCall: any, mapFunction: any) {
    const isFirstCall = !this.cat;
    apiCall().subscribe((response: any) => {
      if (isFirstCall) {
        this.cat = response.categoryId;
      }
      const myList = Object.keys(response.timestamps).map((name) => {
        let consumptionValue = response.timestamps[name];
        let predictionValue = response.predictions[name];
        const cons: string = 'consumption';
        const pred: string = 'prediction';
        if (predictionValue == undefined) {
          predictionValue = 0.0;
        }
        if (consumptionValue == undefined) {
          consumptionValue = 0.0;
        }
        const series = [
          { name: cons, value: consumptionValue },
          { name: pred, value: predictionValue },
        ];
        return { name, series };
      });
      this.data = mapFunction(myList);
      // console.log(this.data);
    });
  }

  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.realizationDevicebtn');
    buttons.forEach((button) => {
      if (button.id == buttonNumber) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
