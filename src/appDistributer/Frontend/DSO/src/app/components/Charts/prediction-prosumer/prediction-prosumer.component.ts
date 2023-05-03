import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/data.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-prediction-prosumer',
  templateUrl: './prediction-prosumer.component.html',
  styleUrls: ['./prediction-prosumer.component.css'],
})
export class PredictionProsumerComponent implements OnInit {
  id: string = '';
  data: any[] = [];
  dataConsumers: any = [];
  dataProducers: any = [];
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ff7d41', '#00bcb3'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kW';

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private spiner: NgxSpinnerService,
    private widthService: ScreenWidthService,
    private serviceData: TimestampService
  ) {}

  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    document.getElementById('predictionUserInfoCardBody')!.style.height =
      this.widthService.height * 0.6 + 'px';
    this.PredictionDay('predictionUser1');
    this.activateButton('predictionUser1');
    document.getElementById('modalFadePredictionProsumer')!.style.maxHeight = this.widthService.height * 0.7 + 'px';
  }

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  PredictionWeek(id: string) {
    this.serviceData
      .PredictionProsumer7Days(this.id)
      .subscribe((response: any) => {
        const consumptionTimestamps = response.consumption || {};
        const productionTimestamps = response.production || {};

        // Remove the first item from both objects
        const [, ...consumptionEntries] = Object.entries(consumptionTimestamps);
        const [, ...productionEntries] = Object.entries(productionTimestamps);

        const allTimestamps = {
          ...Object.fromEntries(consumptionEntries),
          ...Object.fromEntries(productionEntries),
        };

        const data = Object.entries(allTimestamps).map(([timestamp, value]) => {
          const date = new Date(timestamp);
          const dayOfWeek = date.toLocaleDateString('en-US', {
            weekday: 'long',
          });
          return { dayOfWeek, timestamp, value };
        });

        const groupedData = data.reduce((acc: any, item: any) => {
          if (!acc[item.dayOfWeek]) {
            acc[item.dayOfWeek] = {
              name: item.dayOfWeek,
              series: [],
            };
          }
          const consumptionValue = consumptionTimestamps[item.timestamp] || 0.0;
          const productionValue = productionTimestamps[item.timestamp] || 0.0;
          const series = [
            { name: 'consumption', value: consumptionValue },
            { name: 'production', value: productionValue },
          ];
          acc[item.dayOfWeek].series.push(...series);
          return acc;
        }, {});

        const finalList = Object.values(groupedData);
        this.activateButton(id);
        this.data = finalList;
      });
  }

  Prediction3Days(id: string) {
    this.serviceData
      .PredictionProsumer3Days(this.id)
      .subscribe((response: any) => {
        const myList: any = [];

        const consumptionTimestamps = response.consumption || {};
        const productionTimestamps = response.production || {};
        const allTimestamps = {
          ...consumptionTimestamps,
          ...productionTimestamps,
        };

        const data = Object.entries(allTimestamps).map(([timestamp, value]) => {
          const date = new Date(timestamp);
          const dayOfWeek = date.toLocaleDateString('en-US', {
            weekday: 'long',
          });
          return { dayOfWeek, timestamp, value };
        });

        const groupedData = data.reduce((acc: any, item: any) => {
          if (!acc[item.dayOfWeek]) {
            acc[item.dayOfWeek] = {
              name: item.dayOfWeek,
              series: [],
            };
          }
          const consumptionValue = consumptionTimestamps[item.timestamp] || 0.0;
          const productionValue = productionTimestamps[item.timestamp] || 0.0;
          const series = [
            { name: 'consumption', value: consumptionValue },
            { name: 'production', value: productionValue },
          ];
          acc[item.dayOfWeek].series.push(...series);
          return acc;
        }, {});

        const finalList = Object.values(groupedData);

        this.data = finalList;
        this.data = this.data.slice(1);
        this.activateButton(id);
      });
  }
  PredictionDay(id: string) {
    this.serviceData
      .PredictionProsumer1Day(this.id)
      .subscribe((response: any) => {
        const myList: any = [];

        const consumptionTimestamps = response.consumption || {};
        const productionTimestamps = response.production || {};
        const allTimestamps = {
          ...consumptionTimestamps,
          ...productionTimestamps,
        };

        Object.keys(allTimestamps).forEach((timestamp) => {
          const consumptionValue = consumptionTimestamps[timestamp] || 0.0;
          const productionValue = productionTimestamps[timestamp] || 0.0;
          const series = [
            { name: 'consumption', value: consumptionValue },
            { name: 'production', value: productionValue },
          ];
          myList.push({ timestamp, series });
        });

        const groupedData: any = {};

        myList.forEach((item: any) => {
          const date = new Date(item.timestamp);
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
        this.activateButton(id);
        this.data = finalList;
      });
  }

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

  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.predictionbtn');
    buttons.forEach((button) => {
      if (button.id == buttonNumber) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
