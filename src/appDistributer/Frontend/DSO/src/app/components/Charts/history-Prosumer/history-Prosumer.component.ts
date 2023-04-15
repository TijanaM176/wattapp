import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { ScaleType, Color } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';

import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-history-Prosumer',
  templateUrl: './history-Prosumer.component.html',
  styleUrls: ['./history-Prosumer.component.css'],
})
export class HistoryProsumerComponent implements OnInit {
  id: string = '';
  data: any;
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
  yAxisLabel = 'Energy in kWh';

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private spiner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spiner.show();
    this.id = this.router.snapshot.params['id'];
    this.HistoryWeek();
  }

  HistoryWeek() {
    this.loadData(
      this.service.HistoryProsumer7Days.bind(this.service)(this.id),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          return { name: dayName, series: item.series };
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
    });
  }
}
