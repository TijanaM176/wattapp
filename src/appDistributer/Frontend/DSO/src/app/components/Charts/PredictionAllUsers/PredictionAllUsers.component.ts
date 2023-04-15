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
        const series = [
          { name: 'consumption', value: consumptionValue },
          { name: 'production', value: productionValue },
        ];
        myList.push({ name, series });
      });
      this.data = myList;
    });
  }

  Prediction3Days() {
    this.service.PredictionNext3Days().subscribe((response: any) => {
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
        const series = [
          { name: 'consumption', value: consumptionValue },
          { name: 'production', value: productionValue },
        ];
        myList.push({ name, series });
      });
      this.data = myList;
    });
  }

  PredictionDay() {
    this.service.PredictionNextDay().subscribe((response: any) => {
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
        const series = [
          { name: 'consumption', value: consumptionValue },
          { name: 'production', value: productionValue },
        ];
        myList.push({ name, series });
      });
      this.data = myList;
    });
  }
}
