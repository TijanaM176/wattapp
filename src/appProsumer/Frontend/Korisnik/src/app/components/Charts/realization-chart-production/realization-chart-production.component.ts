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
@Component({
  selector: 'app-realization-chart-production',
  templateUrl: './realization-chart-production.component.html',
  styleUrls: ['./realization-chart-production.component.css'],
})
export class RealizationChartProductionComponent
  implements OnInit, AfterViewInit
{
  data: any[] = [];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#48bec1', 'rgb(200, 219, 30)'],
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

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  coef: number = 0.6;

  constructor(
    private deviceService: DevicesService,
    private widthService: DeviceWidthService
  ) {}

  exportTable(): void {
    const headerRow = ['Day', 'Production(kW)', 'Predicted Production(kW)'];
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

  ngAfterViewInit(): void {
    const grafik = document.getElementById('grafikPredictionHistory');
    grafik!.style!.height = this.widthService.height * this.coef + 'px';
    document.getElementById('realizPred1')!.classList.add('active');
  }

  ngOnInit(): void {
    document.getElementById(
      'modalFadePredictionRealizationTableBody'
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
      const grafik = document.getElementById('grafikPredictionHistory');
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
    if(data.prediction)
    {
      const myList = Object.keys(data.production.timestamps).map((name) => {
        let consumptionValue = data.production.timestamps[name];
        let predictionValue = data.production.predictions[name];
        const prod: string = 'production';
        const pred: string = 'prediction';
        if (predictionValue == undefined) {
          predictionValue = 0.0;
        }
        if (consumptionValue == undefined) {
          consumptionValue = 0.0;
        }
        const series = [
          { name: prod, value: consumptionValue },
          { name: pred, value: predictionValue },
        ];
        return { name, series };
      });
      this.data = myList.map((item) => {
        const date = new Date(item.name);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        return { name: dayName, series: item.series };
      });
    }
    else
    {
      this.data = [];
    }
  }

  HistoryWeek(id: string) {
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
      const myList = Object.keys(response.production.timestamps).map((name) => {
        let consumptionValue = response.production.timestamps[name];
        let predictionValue = response.production.predictions[name];
        const prod: string = 'production';
        const pred: string = 'prediction';
        if (predictionValue == undefined) {
          predictionValue = 0.0;
        }
        if (consumptionValue == undefined) {
          consumptionValue = 0.0;
        }
        const series = [
          { name: prod, value: consumptionValue },
          { name: pred, value: predictionValue },
        ];
        return { name, series };
      });
      this.data = mapFunction(myList);
      // console.log(this.data);
    });
  }

  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.realizationPredictionbtn');
    buttons.forEach((button) => {
      if (button.id == buttonNumber) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
