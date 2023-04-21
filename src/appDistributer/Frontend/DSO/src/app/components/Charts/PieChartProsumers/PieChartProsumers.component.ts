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
  currentData : any = [];
  currentTitle : string = "Consumption";
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;

  constructor(private service: UsersServiceService,private servicedash:DashboarddataService) {}

  ngOnInit() {
    this.servicedash.CityPercentages().subscribe((response) => {
      this.data = response;
      this.dataConsumers = Object.entries(this.data.Consumption).map(
        ([name, value]) => ({
          name,
          value,
        })
      );
      this.dataProducers = Object.entries(this.data.Production).map(
        ([name, value]) => ({
          name,
          value,
        })
      );
      this.currentData = this.dataConsumers;
    });
  }
  getArcLabel(data: any): string {
    const total = this.data.reduce(
      (acc: any, curr: any) => acc + curr.value,
      0
    );
    const percentage = ((data.value / total) * 100).toFixed(2);
    return `${percentage}%`;
  }

  onRadioButtonChange(event: any, type: string) {
    if (type === 'consumers') {
      this.isConsumersChecked = event.target.checked;
      if (this.isConsumersChecked) {
        this.isConsumersChecked = true;
        this.isProducersChecked = false;
        this.currentData = this.dataConsumers;
        this.currentTitle = "Consumption";
      } else {
        this.isConsumersChecked = false;
        this.isProducersChecked = true;
        this.currentData = this.dataProducers;
        this.currentTitle = "Production";
      }
    } else if (type === 'producers') {
      this.isProducersChecked = event.target.checked;
      if (this.isProducersChecked) {
        this.isConsumersChecked = false;
        this.isProducersChecked = true;
        this.currentData = this.dataProducers;
        this.currentTitle = "Production";
      } else {
        this.isConsumersChecked = true;
        this.isProducersChecked = false;
        this.currentData = this.dataConsumers;
        this.currentTitle = "Consumption";
      }
    }
  }

  labels(value: number): string {
    return value + ' kW';
  }
}
