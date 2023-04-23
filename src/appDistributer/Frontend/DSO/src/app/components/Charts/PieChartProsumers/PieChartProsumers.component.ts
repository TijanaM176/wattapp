import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { DashboarddataService } from 'src/app/services/dashboarddata.service';

@Component({
  selector: 'app-PieChartProsumers',
  templateUrl: './PieChartProsumers.component.html',
  styleUrls: ['./PieChartProsumers.component.css'],
})
export class PieChartProsumersComponent implements OnInit {
  isConsumersChecked = true;
  isProducersChecked = false;
  production = false;

  consumption = true;
  colorScheme: any = {
    domain: ['#FF414E'],
  };
  colorScheme1: any = {
    domain: ['#80BC00'],
  };
  dataConsumers: any = [];
  dataProducers: any = [];
  data: any = [];
  currentData: any = [];
  currentTitle: string = 'Consumption';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;

  constructor(
    private service: UsersServiceService,
    private servicedash: DashboarddataService
  ) {}

  ngOnInit() {
    this.servicedash.CityPercentages().subscribe((response) => {
      this.data = response;
      this.dataConsumers = Object.entries(this.data.numbers.Consumption).map(
        ([name, value]) => ({
          name,
          value,
        })
      );
      this.dataProducers = Object.entries(this.data.numbers.Production).map(
        ([name, value]) => ({
          name,
          value,
        })
      );
      this.currentData = this.dataConsumers;
    });
  }

  onRadioButtonChange(event: any, type: string) {
    if (type === 'consumers') {
      this.isConsumersChecked = event.target.checked;
      this.isProducersChecked = !this.isConsumersChecked;
      this.currentData = this.isConsumersChecked
        ? this.dataConsumers
        : this.dataProducers;
      this.currentTitle = this.isConsumersChecked
        ? 'Consumption'
        : 'Production';
    } else if (type === 'producers') {
      this.isProducersChecked = event.target.checked;
      this.isConsumersChecked = !this.isProducersChecked;
      this.currentData = this.isProducersChecked
        ? this.dataProducers
        : this.dataConsumers;
      this.currentTitle = this.isProducersChecked
        ? 'Production'
        : 'Consumption';
    }
  }

  labels(value: number): string {
    return value + ' kW';
  }
}
