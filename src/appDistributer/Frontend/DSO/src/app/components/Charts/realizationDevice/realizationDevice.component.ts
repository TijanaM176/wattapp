import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Color,
  ColorHelper,
  LegendPosition,
  ScaleType,
} from '@swimlane/ngx-charts';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

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
    domain: ['#FF414E', '#F4C430'],
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
  show!: boolean;
  @Input() type: string = '';

  constructor(
    private deviceService: DeviceserviceService,
    private widthService: ScreenWidthService,
    private timeService: TimestampService,
    private router1: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  exportTable(): void {
    let headerRow: any = [];
    if (this.type == 'Consumption')
      headerRow = ['Day', 'Consumption ', 'Predicted Consumption (kW)'];
    else headerRow = ['Day', 'Production ', 'Predicted Production (kW)'];

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

  ngAfterViewInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    const grafik = document.getElementById('RealizationDevice');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    document.getElementById('realiz1')!.classList.add('active');
    this.HistoryWeek('realiz1');
  }

  ngOnInit(): void {
    const grafik = document.getElementById('RealizationDevice');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    document.getElementById('realiz1')!.classList.add('active');
    this.idDev = this.router1.snapshot.params['idDev'];

    this.HistoryWeekInit('realiz1');
    document.getElementById('modalFadeHistoryDevice')!.style.maxHeight =
      this.widthService.height * 0.7 + 'px';
    this.HistoryWeek('realiz1');
  }

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }
  HistoryWeekInit(id: string) {
    this.loadData(
      this.timeService.historyDeviceWeek.bind(this.timeService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayNumber = date.getDate();
          const monthName = date.toLocaleString('default', { month: 'long' });
          this.activateButton(id);
          return { name: monthName + ' ' + dayNumber, series: item.series };
        });
        // this.spinner.hide();
      }
    );
  }
  HistoryWeek(id: string) {
    this.show = true;
    this.spinner.show();
    this.loadData(
      this.timeService.historyDeviceWeek.bind(this.timeService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayNumber = date.getDate();
          const monthName = date.toLocaleString('default', { month: 'long' });
          this.activateButton(id);
          return { name: monthName + ' ' + dayNumber, series: item.series };
        });
        // this.spinner.hide();
      }
    );
  }

  HistoryMonth(id: string) {
    this.show = true;
    this.spinner.show();
    this.loadData(
      this.timeService.historyDeviceMonth.bind(this.timeService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayNumber = date.getDate();
          const monthName = date.toLocaleString('default', { month: 'long' });
          this.activateButton(id);
          return { name: monthName + ' ' + dayNumber, series: item.series };
        });
      }
    );
  }

  HistoryYear(id: string) {
    this.show = true;
    this.spinner.show();
    this.loadData(
      this.timeService.historyDeviceYear.bind(this.timeService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const monthName = date.toLocaleDateString('en-US', { month: 'long' });
          this.activateButton(id);
          return { name: monthName, series: item.series };
        });
        // this.spinner.hide();
      }
    );
  }

  loadData(apiCall: any, mapFunction: any) {
    apiCall().subscribe((response: any) => {
      const myList = Object.keys(response.timestamps).map((name) => {
        let consumptionValue = response.timestamps[name];
        let predictionValue = response.predictions[name];
        const cons: string = this.type.toLowerCase();
        const pred: string = 'prediction';
        if (this.type == 'Production') {
          this.colors = {
            name: 'mycolors',
            selectable: true,
            group: ScaleType.Ordinal,
            domain: ['#80BC00', '#F4C430'],
          };
        }
        if (this.type == 'Storage') {
          this.colors = {
            name: 'mycolors',
            selectable: true,
            group: ScaleType.Ordinal,
            domain: ['#2a96d9', '#F4C430'],
          };
        }
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
      this.spinner.hide();
      this.show = false;
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
