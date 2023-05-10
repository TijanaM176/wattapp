import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.css'],
})
export class PredictionChartComponent implements OnInit, AfterViewInit {
  chart: any;
  data: any[] = ['z'];
  id: string = '';

  show!: boolean;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  coef: number = 0.6;

  constructor(
    private deviceService: DevicesService,
    private widthService: DeviceWidthService,
    private spiner1: NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    const grafik = document.getElementById(
      'grafikPredictionConsumptionProduction'
    );
    grafik!.style!.height = this.widthService.height * this.coef + 'px';
    document.getElementById('prediction1')!.classList.add('active');
  }

  exportTable(data: any[]): void {
    const headerRow = [
      '',
      'Predicted Consumption (kW)',
      'Predicted Production (kW)',
    ];
    const sheetData = [headerRow];

    const maxLength = Math.max(data[0]?.values.length, data[1]?.values.length);

    for (let i = 0; i < maxLength; i++) {
      const consumptionValue = data[0]?.values[i];
      const productionValue = data[1]?.values[i];

      const row = [
        consumptionValue
          ? consumptionValue.x
          : productionValue
          ? productionValue.x
          : '',
        consumptionValue ? consumptionValue.y.toFixed(2) : 0,
        productionValue ? productionValue.y.toFixed(2) : 0,
      ];

      sheetData.push(row);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }

  ngOnInit(): void {
    document.getElementById('modalFadePredictionDataBody')!.style.maxHeight =
      this.widthService.height * 0.6 + 'px';

    if (
      this.widthService.deviceWidth >= 576 ||
      this.widthService.height >= this.widthService.deviceWidth * 2
    )
      this.coef = 0.5;

    this.PredictionWeek('prediction1');

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.coef = 0.6;
      if (
        this.widthService.deviceWidth >= 576 ||
        this.widthService.height >= this.widthService.deviceWidth * 2
      )
        this.coef = 0.5;
      const grafik = document.getElementById(
        'grafikPredictionConsumptionProduction'
      );
      grafik!.style!.height = this.widthService.height * this.coef + 'px';
    });
  }

  PredictionWeek(id: string) {
    this.show = true;
    this.activateButton(id);
    this.spiner1.show('spiner1');
    this.deviceService.prediction1Week().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};

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
        this.spiner1.hide('spiner1');
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(255, 125, 65, 1)',
            borderColor: 'rgba(255, 125, 65, 0.5)',
          },
          {
            label: 'Production',
            data: productionData,
            backgroundColor: 'rgba(0, 188, 179, 1)',
            borderColor: 'rgba(0, 188, 179, 0.5)',
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvas1'
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
          hover: {
            mode: 'index',
            intersect: true,
          },
        },
      });

      this.activateButton(id);
      this.spiner1.hide('spiner1');
      this.show = false;
    });
  }

  Prediction3Days(id: string) {
    this.show = true;
    this.activateButton(id);
    this.spiner1.show('spiner1');
    this.deviceService.prediction3Days().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};

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
        this.spiner1.hide('spiner1');
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(255, 125, 65, 1)',
            borderColor: 'rgba(255, 125, 65, 0.5)',
          },
          {
            label: 'Production',
            data: productionData,
            backgroundColor: 'rgba(0, 188, 179, 1)',
            borderColor: 'rgba(0, 188, 179, 0.5)',
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvas1'
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

      this.activateButton(id);
      this.spiner1.hide('spiner1');
      this.show = false;
    });
  }
  Prediction1Day(id: string) {
    this.show = true;
    this.activateButton(id);
    this.spiner1.show('spiner1');
    this.deviceService.prediction1Day().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};

      const consumptionData = Object.keys(consumptionTimestamps).map(
        (name: any) => {
          const date = new Date(name);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return {
            x: `${hours}:${minutes}H`,
            y: consumptionTimestamps[name] || 0.0,
          };
        }
      );

      const productionData = Object.keys(productionTimestamps).map(
        (name: any) => {
          const date = new Date(name);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return {
            x: `${hours}:${minutes}H`,
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
        this.spiner1.hide('spiner1');
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(255, 125, 65, 1)',
            borderColor: 'rgba(255, 125, 65, 0.5)',
          },
          {
            label: 'Production',
            data: productionData,
            backgroundColor: 'rgba(0, 188, 179, 1)',
            borderColor: 'rgba(0, 188, 179, 0.5)',
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvas1'
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

      this.activateButton(id);
      this.spiner1.hide('spiner1');
      this.show = false;
    });
  }

  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.predictionbtn');
    buttons.forEach((button) => {
      if (button.id == buttonNumber) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
