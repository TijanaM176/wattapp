import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { DashboarddataService } from 'src/app/services/dashboarddata.service';
import * as XLSX from 'xlsx';

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

  exportTable(): void {
    let headerRow: any = [];
    if (this.currentData == this.dataProducers)
      headerRow = ['City', 'Current Production (kW)'];
    else headerRow = ['City', 'Current Consumption (kW)'];
    const sheetData = [
      headerRow,
      ...this.currentData.map((data: any) => {
        const seriesValues = data.series
          ? data.series.map((series: { value: any }) => series.value)
          : [0];
        return [data.name, ...seriesValues];
      }),
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }

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
      console.log(this.dataConsumers,this.dataProducers);
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
