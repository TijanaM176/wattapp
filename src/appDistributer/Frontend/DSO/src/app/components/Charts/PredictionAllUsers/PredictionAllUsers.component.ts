import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';

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

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute
  ) {}
  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  ngOnInit() {
    this.PredictionDay();
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

  PredictionWeek() {
    this.service.PredictionNextWeek().subscribe((response: any) => {
      console.log(response);
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
      this.data = myList;
    });
  }

  Prediction3Days() {
    this.service.PredictionNext3Days().subscribe((response: any) => {
      console.log(response);
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
      this.data = myList;
    });
  }

  PredictionDay() {
    this.service.PredictionNextDay().subscribe((response: any) => {
      console.log(response);
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
      this.data = myList;
    });
  }
}
