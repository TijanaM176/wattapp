import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendPosition } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { line } from 'd3-shape';
import { scaleBand, scaleLinear } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboarddataService } from 'src/app/services/dashboarddata.service';
import { TimestampService } from 'src/app/services/timestamp.service';

@Component({
  selector: 'app-realizationPredictionAllProsumers',
  templateUrl: './realizationPredictionAllProsumers.component.html',
  styleUrls: ['./realizationPredictionAllProsumers.component.css'],
})
export class RealizationPredictionAllProsumersComponent implements OnInit {
  production = true;
  consumption = true;
  legendPosition: LegendPosition = 'below' as LegendPosition;
  id: string = '';
  data: any = [];
  dataConsumers: any = [];
  dataProducers: any = [];
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF0000', '#93FF00 ', '#0028A4', '#068700'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  yAxisLabel = 'Energy in kWh';

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private servicetime:TimestampService
  ) {}

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  ngOnInit() {
    this.spinner.show();
    this.HistoryWeek();
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
  HistoryWeek() {
    const apiCall = this.servicetime.HistoryAllProsumers7Days.bind(this.service);
    this.loadData(apiCall, (myList: any[]) => {
      const seriesData: any = [];
      myList.forEach((item) => {
        const date = new Date(item.name);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        item.series.forEach((seriesItem: any, index: any) => {
          if (!seriesData[index]) {
            seriesData[index] = { name: seriesItem.name, series: [] };
          }
          seriesData[index].series.push({
            name: dayName,
            value: seriesItem.value,
          });
        });
      });
      return seriesData;
    });
  }

  HistoryMonth() {
    let apiCall = this.servicetime.HistoryAllProsumers1Month.bind(this.service);
    this.loadData(apiCall, (myList: any[]) => {
      const seriesData: any = [];
      myList.forEach((item) => {
        const date = new Date(item.name);
        const weekNumber = this.getWeek(date);
        item.series.forEach((seriesItem: any, index: any) => {
          if (!seriesData[index]) {
            seriesData[index] = { name: seriesItem.name, series: [] };
          }
          seriesData[index].series.push({
            name: `Week ${weekNumber}`,
            value: seriesItem.value,
          });
        });
      });
      return seriesData;
    });
  }

  HistoryYear() {
    const apiCall = this.servicetime.HistoryAllProsumers1Year.bind(this.service);
    this.loadData(apiCall, (myList: any[]) => {
      const seriesData: any = [];
      myList.forEach((item) => {
        const date = new Date(item.name);
        const monthName = date.toLocaleDateString('en-US', { month: 'long' });
        item.series.forEach((seriesItem: any, index: any) => {
          if (!seriesData[index]) {
            seriesData[index] = { name: seriesItem.name, series: [] };
          }
          seriesData[index].series.push({
            name: monthName,
            value: seriesItem.value,
          });
        });
      });
      return seriesData;
    });
  }

  loadData(apiCall: any, mapFunction: any) {
    apiCall().subscribe((response: any) => {
      const myList: any = [];

      const consumptionTimestamps = response.consumption.timestamps || {};
      const consumptionPredictions = response.consumption.predictions || {};
      const productionTimestamps = response.production.timestamps || {};
      const productionPredictions = response.production.predictions || {};

      const allTimestamps = {
        ...consumptionTimestamps,
        ...productionTimestamps,
      };

      Object.keys(allTimestamps).forEach((name) => {
        const consumptionValue = consumptionTimestamps[name] || 0.0;
        const consumptionPredictionValue = consumptionPredictions[name] || 0.0;
        const productionValue = productionTimestamps[name] || 0.0;
        const productionPredictionValue = productionPredictions[name] || 0.0;

        const series = [
          { name: 'Consumption', value: consumptionValue },
          { name: 'Production', value: productionValue },
          {
            name: 'Prediction for Consumption',
            value: consumptionPredictionValue,
          },
          {
            name: 'Prediction for Production',
            value: productionPredictionValue,
          },
        ];

        myList.push({ name, series });
      });

      this.data = mapFunction(myList);
      this.spinner.hide();
      console.log(this.data);
    });
  }
}
