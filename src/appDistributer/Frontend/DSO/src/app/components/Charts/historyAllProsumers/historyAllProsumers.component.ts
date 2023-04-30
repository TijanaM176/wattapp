import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimestampService } from 'src/app/services/timestamp.service';
import { tickStep } from 'd3';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-historyAllProsumers',
  templateUrl: './historyAllProsumers.component.html',
  styleUrls: ['./historyAllProsumers.component.css'],
})
export class HistoryAllProsumersComponent implements OnInit {
  production = true;
  consumption = true;
  id: string = '';
  data: any = [];
  dataConsumers: any = [];
  dataProducers: any = [];
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF414E', '#80BC00'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private servicetime: TimestampService
  ) {}

  exportTable(): void {
    const headerRow = ['Day', 'Consumption (kW)', 'Production (kW)'];
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
  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  ngOnInit() {
    this.HistoryWeek();
  }

  HistoryMonth() {
    this.servicetime.HistoryAllProsumers1Month().subscribe((response: any) => {
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

  HistoryYear() {
    this.servicetime.HistoryAllProsumers1Year().subscribe((response: any) => {
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

  HistoryWeek() {
    this.servicetime.HistoryAllProsumers7Days().subscribe((response: any) => {
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
}
