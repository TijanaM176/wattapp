import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
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
  colorsC: Color = {
    name: 'mycolors1',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF414E'],
  };
  colorsP: Color = {
    name: 'mycolors2',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#80BC00'],
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
    this.loadData(
      this.service.HistoryAllProsumers7Days.bind(this.service),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          return { name: dayName, series: item.series };
        });
      }
    );
  }

  HistoryMonth() {
    this.loadData(
      this.service.HistoryAllProsumers1Month.bind(this.service),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const weekNumber = this.getWeek(date);
          return { name: `Week ${weekNumber}`, series: item.series };
        });
      }
    );
  }

  HistoryYear() {
    this.loadData(
      this.service.HistoryAllProsumers1Year.bind(this.service),
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
      const myList = Object.keys(response.consumption.timestamps).map(
        (name) => {
          let consumptionValue = response.consumption.timestamps[name];
          let productionValue = response.production.timestamps[name];
          const cons: string = 'consumption';
          const prod: string = 'producton';
          if (productionValue == undefined) {
            productionValue = 0.0;
          }
          if (consumptionValue == undefined) {
            consumptionValue = 0.0;
          }
          const series = [
            { name: cons, value: consumptionValue },
            { name: prod, value: productionValue },
          ];
          return { name, series };
        }
      );
      this.data = mapFunction(myList);
    });
  }
}
