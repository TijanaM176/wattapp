import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { TimestampService } from 'src/app/services/timestamp.service';

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
    private router: ActivatedRoute,
    private servicetime: TimestampService
  ) {}
  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  ngOnInit() {
    this.PredictionDay();
  }

  PredictionWeek() {
    this.servicetime.PredictionNextWeek().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};
      const allTimestamps = {
        ...consumptionTimestamps,
        ...productionTimestamps,
      };

      const data = Object.entries(allTimestamps).map(([timestamp, value]) => {
        const date = new Date(timestamp);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
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
    });
  }

  Prediction3Days() {
    this.servicetime.PredictionNext3Days().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};
      const allTimestamps = {
        ...consumptionTimestamps,
        ...productionTimestamps,
      };

      const data = Object.entries(allTimestamps).map(([timestamp, value]) => {
        const date = new Date(timestamp);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
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
    });
  }

  PredictionDay() {
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
}
