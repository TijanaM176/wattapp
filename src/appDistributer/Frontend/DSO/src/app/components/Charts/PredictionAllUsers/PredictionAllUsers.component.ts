import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { TimestampService } from 'src/app/services/timestamp.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { ScreenWidthService } from 'src/app/services/screen-width.service';

@Component({
  selector: 'app-PredictionAllUsers',
  templateUrl: './PredictionAllUsers.component.html',
  styleUrls: ['./PredictionAllUsers.component.css'],
})
export class PredictionAllUsersComponent implements OnInit {
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
  show!: boolean;
  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private servicetime: TimestampService,
    private spinner: NgxSpinnerService,
    private widthService: ScreenWidthService
  ) {}

  exportTable(): void {
    const headerRow = [
      'Day',
      'Predicted Consumption (kW)',
      'Predicted Production (kW)',
    ];
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
    this.PredictionDayInit();
    document.getElementById(
      'modalFadePredictionAllProsumers'
    )!.style.maxHeight = this.widthService.height * 0.7 + 'px';
  }

  PredictionWeek() {
    this.show = true;
    this.spinner.show();
    this.servicetime.PredictionNextWeek().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};

      const data = Object.keys({
        ...consumptionTimestamps,
        ...productionTimestamps,
      }).map((timestamp) => {
        const date = new Date(timestamp);
        const name = `${date.toLocaleString('default', {
          month: 'long',
        })} ${date.getDate()}`;
        const consumptionValue = consumptionTimestamps[timestamp] || 0.0;
        const productionValue = productionTimestamps[timestamp] || 0.0;
        return {
          name,
          series: [
            { name: 'consumption', value: consumptionValue },
            { name: 'production', value: productionValue },
          ],
        };
      });

      const finalList = Object.values(
        data.reduce((acc: any, { name, series }) => {
          acc[name] = acc[name] || { name, series: [] };
          acc[name].series.push(...series);
          return acc;
        }, {})
      );

      this.data = finalList;
      this.data = this.data.slice(1);
      this.show = false;
      this.spinner.hide();
    });
  }

  Prediction3Days() {
    this.show = true;
    this.spinner.show();
    this.servicetime.PredictionNext3Days().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};

      const data = Object.keys({
        ...consumptionTimestamps,
        ...productionTimestamps,
      }).map((timestamp) => {
        const date = new Date(timestamp);
        const name = `${date.toLocaleString('default', {
          month: 'long',
        })} ${date.getDate()}`;
        const consumptionValue = consumptionTimestamps[timestamp] || 0.0;
        const productionValue = productionTimestamps[timestamp] || 0.0;
        return {
          name,
          series: [
            { name: 'consumption', value: consumptionValue },
            { name: 'production', value: productionValue },
          ],
        };
      });

      const finalList = Object.values(
        data.reduce((acc: any, { name, series }) => {
          acc[name] = acc[name] || { name, series: [] };
          acc[name].series.push(...series);
          return acc;
        }, {})
      );

      this.data = finalList;
      this.data = this.data.slice(1);
      this.show = false;
      this.spinner.hide();
    });
  }
  PredictionDayInit() {
    this.servicetime.PredictionNextDay().subscribe((response: any) => {
      const myList: any = [];

      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};
      const allTimestamps = {
        ...consumptionTimestamps,
        ...productionTimestamps,
      };

      Object.keys(allTimestamps).forEach((name) => {
        const consumptionValue = consumptionTimestamps[name] || 0.0;
        const productionValue = productionTimestamps[name] || 0.0;
        const series = [
          { name: 'consumption', value: consumptionValue },
          { name: 'production', value: productionValue },
        ];
        myList.push({ name, series });
      });

      const groupedData: any = {};

      myList.forEach((item: any) => {
        const date = new Date(item.name);
        const hour = date.getHours();
        const hourString = hour < 10 ? '0' + hour : hour.toString();
        const name = hourString + ':00h';
        if (!groupedData[name]) {
          groupedData[name] = {
            name,
            series: [],
          };
        }
        groupedData[name].series.push(...item.series);
      });

      const finalList = Object.values(groupedData);

      this.data = finalList;
    });
  }

  PredictionDay() {
    this.show = true;
    this.spinner.show();
    this.servicetime.PredictionNextDay().subscribe((response: any) => {
      const data: any = [];
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};
      const allTimestamps = {
        ...consumptionTimestamps,
        ...productionTimestamps,
      };

      const groupedData: any = {};
      Object.entries(allTimestamps).forEach(([timestamp, value]) => {
        const date = new Date(timestamp);
        const hour = date.getHours();
        const hourString = hour < 10 ? '0' + hour : hour.toString();
        const name = hourString + ':00h';

        if (!groupedData[name]) {
          groupedData[name] = {
            name,
            series: [],
          };
        }

        const consumptionValue = consumptionTimestamps[timestamp] || 0.0;
        const productionValue = productionTimestamps[timestamp] || 0.0;
        const series = [
          { name: 'consumption', value: consumptionValue },
          { name: 'production', value: productionValue },
        ];

        groupedData[name].series.push(...series);
      });

      const finalList = Object.values(groupedData);
      this.data = finalList;
      this.show = false;
      this.spinner.hide();
    });
  }
}
