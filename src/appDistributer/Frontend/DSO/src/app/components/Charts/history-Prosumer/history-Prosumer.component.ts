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
      this.spiner.hide();
    });
  }
}
