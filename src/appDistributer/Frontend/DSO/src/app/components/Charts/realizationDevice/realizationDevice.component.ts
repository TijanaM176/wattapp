import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-realizationDevice',
  templateUrl: './realizationDevice.component.html',
  styleUrls: ['./realizationDevice.component.css'],
})
export class RealizationDeviceComponent implements OnInit, AfterViewInit {
  chart: any;
  data: any[] = ['z'];
  idDev: string = '';
  show!: boolean;
  @Input() type: string = '';

  constructor(
    private widthService: ScreenWidthService,
    private timeService: TimestampService,
    private router1: ActivatedRoute,
    private spiner: NgxSpinnerService
  ) {}

  exportTable(): void {
    let headerRow: any = [];
    if (this.type === 'Consumption') {
      headerRow = ['', 'Consumption', 'Predicted Consumption (kW)'];
    } else {
      headerRow = ['', 'Production', 'Predicted Production (kW)'];
    }

    const sheetData = [headerRow];
    for (let i = 0; i < this.data[0].values.length; i++) {
      const rowData = [this.data[0].values[i].x];

      const consumptionValue = this.data[0].values[i].y.toFixed(2);
      const predictedValue = this.data[1].values[i].y.toFixed(2);
      rowData.push(consumptionValue);
      rowData.push(predictedValue);

      sheetData.push(rowData);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }

  ngAfterViewInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    const grafik = document.getElementById('RealizationDevice');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    document.getElementById('realiz1')!.classList.add('active');
    this.HistoryWeek('realiz1');
  }

  ngOnInit(): void {
    const grafik = document.getElementById('RealizationDevice');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    document.getElementById('realiz1')!.classList.add('active');
    this.idDev = this.router1.snapshot.params['idDev'];
    document.getElementById('modalFadeHistoryDevice')!.style.maxHeight =
      this.widthService.height * 0.7 + 'px';
    this.HistoryWeek('realiz1');
  }

  HistoryWeek(id: string) {
    this.show = true;
    this.spiner.show();
    this.activateButton(id);
    this.timeService
      .historyDeviceWeek(this.idDev)
      .subscribe({
        next:(response)=> {
          const consumptionTimestamps = response.timestamps || {};
          const productionTimestamps = response.predictions || {};
  
          const consumptionData = Object.keys(consumptionTimestamps).map(
            (name: any) => {
              const date = new Date(name);
              const dayNumber = date.getDate();
              const monthName = date.toLocaleString('default', { month: 'long' });
              return {
                x: `${monthName} ${dayNumber}`,
                y: consumptionTimestamps[name] || 0.0,
              };
            }
          );
  
          const productionData = Object.keys(productionTimestamps).map(
            (name: any) => {
              const date = new Date(name);
              const dayNumber = date.getDate();
              const monthName = date.toLocaleString('default', { month: 'long' });
              return {
                x: `${monthName} ${dayNumber}`,
                y: productionTimestamps[name] || 0.0,
              };
            }
          );
          productionData[0]
            ? (this.data = [
                { type: 'consumption', values: consumptionData },
                { type: 'production', values: productionData },
              ])
            : (this.data = []);
  
          if (this.data.length == 0) {
            this.spiner.hide();
            this.show = false;
            return;
          }
  
          let backgroundColor, borderColor, backgroundColor1, borderColor1;
          if (this.type === 'Consumption') {
            backgroundColor = 'rgba(193, 75, 72, 1)';
            borderColor = 'rgba(193, 75, 72, 1)';
            backgroundColor1 = 'rgba(255, 125, 65, 1)';
            borderColor1 = 'rgba(255, 125, 65,0.5)';
          } else if (this.type === 'Production') {
            backgroundColor = 'rgba(128, 188, 0, 1)';
            borderColor = 'rgba(128, 188, 0, 1)';
            backgroundColor1 = 'rgba(0, 188, 179, 1)';
            borderColor1 = 'rgba(0, 188, 179, 0.5)';
          }
  
          const chartData = {
            datasets: [
              {
                label: 'Energy ' + this.type,
                data: consumptionData,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
              },
              {
                label: 'Predicted Energy ' + this.type,
                data: productionData,
                backgroundColor: backgroundColor1,
                borderColor: borderColor1,
              },
            ],
          };
  
          const chartElement: any = document.getElementById(
            'RealizationDeviceChart'
          ) as HTMLElement;
          if (this.chart) {
            this.chart.destroy();
          }
          const chart2d = chartElement.getContext('2d');
          this.chart = new Chart(chart2d, {
            type: 'bar',
            data: chartData,
            options: {
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
              maintainAspectRatio: false,
            },
          });
  
          this.spiner.hide();
          this.show = false;
        },
        error:(err)=>{
          console.log(err);
          this.data = [];
          this.spiner.hide();
          this.show = false;
        }
      });
  }

  HistoryMonth(id: string) {
    this.show = true;
    this.spiner.show();
    this.activateButton(id);
    this.timeService
      .historyDeviceMonth(this.idDev)
      .subscribe({
        next:(response) => {
          const consumptionTimestamps = response.timestamps || {};
          const productionTimestamps = response.predictions || {};
  
          const consumptionData = Object.keys(consumptionTimestamps).map(
            (name: any) => {
              const date = new Date(name);
              const dayNumber = date.getDate();
              const monthName = date.toLocaleString('default', { month: 'long' });
              return {
                x: `${monthName} ${dayNumber}`,
                y: consumptionTimestamps[name] || 0.0,
              };
            }
          );
  
          const productionData = Object.keys(productionTimestamps).map(
            (name: any) => {
              const date = new Date(name);
              const dayNumber = date.getDate();
              const monthName = date.toLocaleString('default', { month: 'long' });
              return {
                x: `${monthName} ${dayNumber}`,
                y: productionTimestamps[name] || 0.0,
              };
            }
          );
          productionData[0]
            ? (this.data = [
                { type: 'consumption', values: consumptionData },
                { type: 'production', values: productionData },
              ])
            : (this.data = []);
  
          if (this.data.length == 0) {
            this.spiner.hide();
            this.show = false;
            return;
          }
  
          let backgroundColor, borderColor, backgroundColor1, borderColor1;
          if (this.type === 'Consumption') {
            backgroundColor = 'rgba(193, 75, 72, 1)';
            borderColor = 'rgba(193, 75, 72, 1)';
            backgroundColor1 = 'rgba(255, 125, 65, 1)';
            borderColor1 = 'rgba(255, 125, 65,0.5)';
          } else if (this.type === 'Production') {
            backgroundColor = 'rgba(128, 188, 0, 1)';
            borderColor = 'rgba(128, 188, 0, 1)';
            backgroundColor1 = 'rgba(0, 188, 179, 1)';
            borderColor1 = 'rgba(0, 188, 179, 0.5)';
          }
  
          const chartData = {
            datasets: [
              {
                label: 'Energy ' + this.type,
                data: consumptionData,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
              },
              {
                label: 'Predicted Energy ' + this.type,
                data: productionData,
                backgroundColor: backgroundColor1,
                borderColor: borderColor1,
              },
            ],
          };
  
          const chartElement: any = document.getElementById(
            'RealizationDeviceChart'
          ) as HTMLElement;
          if (this.chart) {
            this.chart.destroy();
          }
          const chart2d = chartElement.getContext('2d');
          this.chart = new Chart(chart2d, {
            type: 'bar',
            data: chartData,
            options: {
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
              maintainAspectRatio: false,
            },
          });
  
          this.spiner.hide();
          this.show = false;
        },
        error:(err)=>{
          console.log(err);
          this.data = [];
          this.spiner.hide();
          this.show = false;
        }
      });
  }

  HistoryYear(id: string) {
    this.show = true;
    this.spiner.show();
    this.activateButton(id);
    this.timeService
      .historyDeviceYear(this.idDev)
      .subscribe({
        next:(response)=> {
          const consumptionTimestamps = response.timestamps || {};
          const productionTimestamps = response.predictions || {};
  
          const consumptionData = Object.keys(consumptionTimestamps).map(
            (name: any) => {
              const date = new Date(name);
              const monthName = date.toLocaleString('default', { month: 'long' });
              return {
                x: `${monthName} `,
                y: consumptionTimestamps[name] || 0.0,
              };
            }
          );
  
          const productionData = Object.keys(productionTimestamps).map(
            (name: any) => {
              const date = new Date(name);
              const monthName = date.toLocaleString('default', { month: 'long' });
              return {
                x: `${monthName} `,
                y: productionTimestamps[name] || 0.0,
              };
            }
          );
          productionData[0]
            ? (this.data = [
                { type: 'consumption', values: consumptionData },
                { type: 'production', values: productionData },
              ])
            : (this.data = []);
  
          if (this.data.length == 0) {
            this.spiner.hide();
            this.show = false;
            return;
          }
  
          let backgroundColor, borderColor, backgroundColor1, borderColor1;
          if (this.type === 'Consumption') {
            backgroundColor = 'rgba(193, 75, 72, 1)';
            borderColor = 'rgba(193, 75, 72, 1)';
            backgroundColor1 = 'rgba(255, 125, 65, 1)';
            borderColor1 = 'rgba(255, 125, 65,0.5)';
          } else if (this.type === 'Production') {
            backgroundColor = 'rgba(128, 188, 0, 1)';
            borderColor = 'rgba(128, 188, 0, 1)';
            backgroundColor1 = 'rgba(0, 188, 179, 1)';
            borderColor1 = 'rgba(0, 188, 179, 0.5)';
          }
  
          const chartData = {
            datasets: [
              {
                label: 'Energy ' + this.type,
                data: consumptionData,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
              },
              {
                label: 'Predicted Energy ' + this.type,
                data: productionData,
                backgroundColor: backgroundColor1,
                borderColor: borderColor1,
              },
            ],
          };
  
          const chartElement: any = document.getElementById(
            'RealizationDeviceChart'
          ) as HTMLElement;
          if (this.chart) {
            this.chart.destroy();
          }
  
          const chart2d = chartElement.getContext('2d');
          this.chart = new Chart(chart2d, {
            type: 'bar',
            data: chartData,
            options: {
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
              maintainAspectRatio: false,
            },
          });
  
          this.spiner.hide();
          this.show = false;
        },
        error:(err)=>{
          console.log(err);
          this.data =[];
          this.spiner.hide();
          this.show = false;
        }
      });
  }

  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.realizationbtn');
    buttons.forEach((button) => {
      if (button.id == buttonNumber) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
