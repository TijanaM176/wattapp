import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { ScaleType, Color, LegendPosition } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimestampService } from 'src/app/services/timestamp.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import * as XLSX from 'xlsx';

import { UsersServiceService } from 'src/app/services/users-service.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-history-Prosumer',
  templateUrl: './history-Prosumer.component.html',
  styleUrls: ['./history-Prosumer.component.css'],
})
export class HistoryProsumerComponent implements OnInit {
  data: any[] = [];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#c14b48', '#80BC00'],
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
  id!: string;

  constructor(
    private deviceService: DeviceserviceService,
    private widthService: ScreenWidthService,
    private serviceTime: TimestampService,
    private router: ActivatedRoute,
    private service: UsersServiceService
  ) {}

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

  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    document.getElementById('realizationUserInfoCardBody')!.style.height =
      this.widthService.height * 0.55 + 'px';
    this.HistoryWeek('realiz1');

    document.getElementById('historyProsumerTable')!.style.width =
      window.innerWidth + 'px';
  }

  HistoryWeek(button: string) {
    this.serviceTime
      .HistoryProsumer7Days(this.id)
      .subscribe((response: any) => {
        const myList: any = [];

        const consumptionTimestamps = response.consumption.timestamps || {};
        const productionTimestamps = response.production.timestamps || {};
        const allTimestamps = {
          ...consumptionTimestamps,
          ...productionTimestamps,
        };

        Object.keys(allTimestamps).forEach((name) => {
          const consumptionValue = consumptionTimestamps[name] || 0.0;
          const productionValue = productionTimestamps[name] || 0.0;

          // Create a new Date object from the name string
          const date = new Date(name);

          // Format the date into a readable string
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

          const series = [
            { name: 'consumption', value: consumptionValue },
            { name: 'production', value: productionValue },
          ];

          // Set the name property of the object to the formatted date string
          myList.push({ name: dayName, series });
        });
        this.data = myList;
        this.data = this.data.slice(1);
      });
  }
  HistoryMonth(button: string) {
    this.serviceTime
      .HistoryProsumer1Month(this.id)
      .subscribe((response: any) => {
        const myList: any = [];

        const consumptionTimestamps = response.consumption.timestamps || {};
        const productionTimestamps = response.production.timestamps || {};
        const allTimestamps = {
          ...consumptionTimestamps,
          ...productionTimestamps,
        };

        Object.keys(allTimestamps).forEach((name) => {
          const consumptionValue = consumptionTimestamps[name] || 0.0;
          const productionValue = productionTimestamps[name] || 0.0;

          // Create a new Date object from the name string
          const date = new Date(name);

          // Get the day of the month from the Date object
          const dayNumber = date.getDate();

          const series = [
            { name: 'consumption', value: consumptionValue },
            { name: 'production', value: productionValue },
          ];

          // Set the name property of the object to the formatted date string
          myList.push({ name: dayNumber, series });
        });
        this.data = myList;
        this.data = this.data.slice(0, -1);
      });
  }
  HistoryYear(button: string) {
    this.serviceTime
      .HistoryProsumer1Year(this.id)
      .subscribe((response: any) => {
        const myList: any = [];

        const consumptionTimestamps = response.consumption.timestamps || {};
        const productionTimestamps = response.production.timestamps || {};
        const allTimestamps = {
          ...consumptionTimestamps,
          ...productionTimestamps,
        };

        Object.keys(allTimestamps).forEach((name) => {
          const consumptionValue = consumptionTimestamps[name] || 0.0;
          const productionValue = productionTimestamps[name] || 0.0;

          // Create a new Date object from the name string
          const date = new Date(name);

          // Format the date into a readable string
          const monthName = date.toLocaleDateString('en-US', { month: 'long' });

          const series = [
            { name: 'consumption', value: consumptionValue },
            { name: 'production', value: productionValue },
          ];

          // Set the name property of the object to the formatted date string
          myList.push({ name: monthName, series });
        });
        this.data = myList;
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
