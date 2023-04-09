import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { curveBasis } from 'd3-shape';
@Component({
  selector: 'app-realizationPredictionAllProsumers',
  templateUrl: './realizationPredictionAllProsumers.component.html',
  styleUrls: ['./realizationPredictionAllProsumers.component.css'],
})
export class RealizationPredictionAllProsumersComponent implements OnInit {
  curve: any = curveBasis;
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
    domain: ['#FF414E', '#80BC00', 'orange', 'yellow'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute
  ) {}

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  ngOnInit() {
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
    const apiCall = this.service.HistoryAllProsumers7Days.bind(this.service);
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
    let apiCall = this.service.HistoryAllProsumers1Month.bind(this.service);
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
    const apiCall = this.service.HistoryAllProsumers1Year.bind(this.service);
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
      console.log(response);
      const myList = Object.keys(response.consumption.timestamps).map(
        (name) => {
          let consumptionValue = response.consumption.timestamps[name];
          let productionValue = response.production.timestamps[name];
          let consPredValue = response.consumption.predictions[name];
          let prodPredValue = response.production.predictions[name];
          const series = [
            {
              name: 'Consumption',
              value: consumptionValue !== undefined ? consumptionValue : 0,
            },
            {
              name: 'Production',
              value: productionValue !== undefined ? productionValue : 0,
            },
            {
              name: 'Prediction for Consumption',
              value: consPredValue !== undefined ? consPredValue : 0,
            },
            {
              name: 'Prediction for Production',
              value: prodPredValue !== undefined ? prodPredValue : 0,
            },
          ];
          return { name, series };
        }
      );
      this.data = mapFunction(myList);
      console.log(this.data);
    });
  }
}
