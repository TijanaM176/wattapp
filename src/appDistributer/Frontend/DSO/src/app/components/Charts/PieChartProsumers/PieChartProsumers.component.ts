import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';

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
    domain: ['#FF414E', '#80BC00', '#C7B42C'],
  };
  dataConsumers: any = [];
  dataProducers: any = [];
  data: any = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;

  constructor(private service: UsersServiceService) {}

  ngOnInit() {
    this.service.CityPercentages().subscribe((response) => {
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
      } else {
        this.isConsumersChecked = false;
        this.isProducersChecked = true;
      }
    } else if (type === 'producers') {
      this.isProducersChecked = event.target.checked;
      if (this.isProducersChecked) {
        this.isConsumersChecked = false;
        this.isProducersChecked = true;
      } else {
        this.isConsumersChecked = true;
        this.isProducersChecked = false;
      }
    }
  }
  percFormat(value: number): string {
    const str = value.toFixed(1);
    return str;
  }

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }
}
