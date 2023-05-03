import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Color,
  ColorHelper,
  LegendPosition,
  ScaleType,
} from '@swimlane/ngx-charts';
import * as XLSX from 'xlsx';

import { fromEvent, Observable, Subscription } from 'rxjs';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSpinnerService } from 'ngx-spinner';

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
    domain: ['#238f91', '#d3f72f'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy  ( kWh )';

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  coef: number = 0.6;
  id!: string;
  show!:boolean;

  constructor(
    private deviceService: DeviceserviceService,
    private widthService: ScreenWidthService,
    private serviceTime: TimestampService,
    private router: ActivatedRoute,
    private service: UsersServiceService,
    private spiner:NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    const grafik = document.getElementById('realizationUser');
    grafik!.style.height = this.widthService.height * this.coef + 'px';
    // document.getElementById('realizPred1')!.classList.add("active");
  }

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.HistoryWeekInit('realizPred1');
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
      const grafik = document.getElementById('realizationUser');
      grafik!.style.height = this.widthService.height * this.coef + 'px';
    });
  }

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  exportTable(): void {
    const headerRow = ['Day', 'Production (kW)', 'Predicted Production (kW)'];
    const sheetData = [
      headerRow,
      ...this.data.map((data: any) => [
        data.name,
        ...data.series.map((series: { value: number }) => series.value),
      ]),
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }

  HistoryWeekInit(id: string) {
    this.loadData(
      this.serviceTime.HistoryProsumer7Days.bind(this.deviceService)(this.id),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          return { name: dayName, series: item.series };
        });
      }
    );
    this.activateButton(id);
  }

  HistoryWeek(id: string) {
    this.show=true;
    this.spiner.show();
    this.loadData(
      this.serviceTime.HistoryProsumer7Days.bind(this.service)(this.id),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          this.activateButton(id);
          return { name: dayName, series: item.series };
        });
      }
    );
    this.activateButton(id);
  }

  HistoryMonth(id: string) {
    this.show=true;
    this.spiner.show();
    this.loadData(
      this.serviceTime.HistoryProsumer1Month.bind(this.service)(this.id),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          this.activateButton(id);
          return { name: `Week ${date}`, series: item.series };
        });
      }
    );
    this.activateButton(id);
  }

  HistoryYear(id: string) {
    this.show=true;
    this.spiner.show();
    this.loadData(
      this.serviceTime.HistoryProsumer1Year.bind(this.service)(this.id),
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
    apiCall.subscribe((response: any) => {
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
      this.spiner.hide();
      this.show=false;
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
