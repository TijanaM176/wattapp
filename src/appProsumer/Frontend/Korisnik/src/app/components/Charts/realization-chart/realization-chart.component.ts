import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  Color,
  ColorHelper,
  LegendPosition,
  ScaleType,
} from '@swimlane/ngx-charts';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-realization-chart',
  templateUrl: './realization-chart.component.html',
  styleUrls: ['./realization-chart.component.css'],
})
export class RealizationChartComponent implements OnInit, AfterViewInit {
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
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kWh';
  show!:boolean;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  coef: number = 0.6;

  constructor(
    private deviceService: DevicesService,
    private widthService: DeviceWidthService,
    private spiner:NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    const grafik = document.getElementById('grafik');
    grafik!.style!.height = this.widthService.height * this.coef + 'px';
    document.getElementById('realiz1')!.classList.add('active');
  }

  exportTable(): void {
    const headerRow = ['Day', 'Consumption(kW)', 'Predicted Consumption(kW)'];
    const sheetData = [
      headerRow,
      ...this.data.map((data) => [
        data.name,
        ...data.series.map((series: { value: number }) => series.value),
      ]),
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }

  ngOnInit(): void {
    // this.HistoryWeekInit();
    document.getElementById(
      'modalFadeConsumptionRealizationTableBody'
    )!.style.maxHeight = this.widthService.height * 0.6 + 'px';
    if (
      this.widthService.deviceWidth >= 576 ||
      this.widthService.height >= this.widthService.deviceWidth * 2
    )
      this.coef = 0.5;

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.coef = 0.6;
      if (
        this.widthService.deviceWidth >= 576 ||
        this.widthService.height >= this.widthService.deviceWidth * 2
      )
        this.coef = 0.5;
      const grafik = document.getElementById('grafik');
      grafik!.style!.height = this.widthService.height * this.coef + 'px';
    });
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

  HistoryWeekInit(data: any) {
    this.show=true;
    this.spiner.show();
    const myList = Object.keys(data.consumption.timestamps).map((name) => {
      let consumptionValue = data.consumption.timestamps[name];
      let predictionValue = data.consumption.predictions[name];
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
    this.data = myList.map((item) => {
      const date = new Date(item.name);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      return { name: dayName, series: item.series };
    });
    this.spiner.hide();
    this.show=false;
  }

  HistoryWeek(id: string) {
    this.show=true;
    this.spiner.show();
    this.activateButton(id);
    this.loadData(
      this.deviceService.history7Days.bind(this.deviceService),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          return { name: dayName, series: item.series };
        });
      }
    );
  }

  HistoryMonth(id: string) {
    this.show=true;
    this.spiner.show();
    this.activateButton(id);
    this.loadData(
      this.deviceService.history1Month.bind(this.deviceService),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
          let month =
            date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
          let dateMonth = day + '.' + month + '.' + date.getFullYear() + '.';
          const weekNumber = this.getWeek(date);
          return {
            name: `Week ${weekNumber}`,
            series: item.series,
            date: dateMonth,
          };
        });
      }
    );
  }

  HistoryYear(id: string) {
    this.show=true;
    this.spiner.show();
    this.activateButton(id);
    this.loadData(
      this.deviceService.history1Year.bind(this.deviceService),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const monthName = date.toLocaleDateString('en-US', { month: 'long' });
          return { name: monthName, series: item.series };
        });
      }
    );
  }

  loadData(apiCall: any, mapFunction: any) {
    apiCall().subscribe((response: any) => {
      // console.log(response.consumption);
      const myList = Object.keys(response.consumption.timestamps).map(
        (name) => {
          let consumptionValue = response.consumption.timestamps[name];
          let predictionValue = response.consumption.predictions[name];
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
        }
      );
      this.data = mapFunction(myList);
      this.spiner.hide();
      this.show=false;
      // console.log(this.data);
    });
  }

  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.realizationbtn');
    buttons.forEach((button) => {
      if (button.id == buttonNumber) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
