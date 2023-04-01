import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color } from '@swimlane/ngx-charts';
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
  data: any;
  dataConsumers: any;
  dataProducers: any;
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
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kWh';

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute
  ) {}
  onCheckboxChange() {
    console.log(this.consumption, this.production);
  }

  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    this.service.HistoryAllProsumers7Days().subscribe((response) => {
      this.data = response;
      this.dataConsumers = Object.entries(this.data.consumption).map(
        ([name, value]) => ({ name, value })
      );
      this.dataProducers = Object.entries(this.data.production).map(
        ([name, value]) => ({ name, value })
      );
      const myList = Object.keys(this.data.consumption).map((name) => {
        let consumptionValue = this.data.consumption[name];
        let productionValue = this.data.production[name];
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
      });
      this.data = myList;
      console.log(this.data);
    });
  }
}
