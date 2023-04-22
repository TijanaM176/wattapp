import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { ScaleType, Color } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimestampService } from 'src/app/services/timestamp.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';

import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-history-Prosumer',
  templateUrl: './history-Prosumer.component.html',
  styleUrls: ['./history-Prosumer.component.css'],
})
export class HistoryProsumerComponent implements OnInit {
  id: string = '';
  data: any[] = [];
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
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kW';

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private spiner: NgxSpinnerService,
    private servicetime: TimestampService,
    private widthService: ScreenWidthService
  ) {}

  ngOnInit() {
    this.spiner.show();
    this.id = this.router.snapshot.params['id'];
    document.getElementById('realizationUserInfoCardBody')!.style.height =
      this.widthService.height * 0.5 + 'px';
    this.HistoryWeek();

    document.getElementById('historyProsumerTable')!.style.width = window.innerWidth + 'px';
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
      this.servicetime.HistoryProsumer7Days.bind(this.service)(this.id),
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
      this.servicetime.HistoryProsumer1Month.bind(this.service)(this.id),
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
      this.servicetime.HistoryProsumer1Year.bind(this.service)(this.id),
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
    apiCall.subscribe((response: any) => {
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

      this.data = mapFunction(myList);
      this.spiner.hide();
      console.log(this.data);
    });
  }
}
