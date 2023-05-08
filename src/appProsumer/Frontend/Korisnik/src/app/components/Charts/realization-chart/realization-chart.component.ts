import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  Color,
  ColorHelper,
  LegendPosition,
  ScaleType,
} from '@swimlane/ngx-charts';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-realization-chart',
  templateUrl: './realization-chart.component.html',
  styleUrls: ['./realization-chart.component.css'],
})
export class RealizationChartComponent implements OnInit, AfterViewInit {
  chart: any;
  data: any[] = ['z'];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#c14b48', 'rgb(219, 169, 30)'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kW';
  show!: boolean;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  coef: number = 0.6;

  constructor(
    private deviceService: DevicesService,
    private widthService: DeviceWidthService,
    private spiner: NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    const grafik = document.getElementById('grafikConsumptionHistory');
    grafik!.style!.height = this.widthService.height * this.coef + 'px';
    document.getElementById('realiz1')!.classList.add('active');
  }

  exportTable(data: any[]): void {
    const headerRow = [
      '',
      'Energy Consumption (kW)',
      'Predicted Consumption (kW)',
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
        consumptionValue ? consumptionValue.y.toFixed(5) : 0,
        productionValue ? productionValue.y.toFixed(5) : 0,
      ];

      sheetData.push(row);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }

  ngOnInit(): void {
    this.HistoryWeek('realiz1');
    document.getElementById(
      'modalFadeConsumptionRealizationTableBody'
    )!.style.maxHeight = this.widthService.height * 0.6 + 'px';
    if (
      this.widthService.deviceWidth >= 576 ||
      this.widthService.height >= this.widthService.deviceWidth * 2
    )
      this.coef = 0.5;

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.coef = 0.6;
      if (
        this.widthService.deviceWidth >= 576 ||
        this.widthService.height >= this.widthService.deviceWidth * 2
      )
        this.coef = 0.5;
      const grafik = document.getElementById('grafikConsumptionHistory');
      grafik!.style!.height = this.widthService.height * this.coef + 'px';
    });
  }

  // HistoryWeekInit(data: any) {
  //   if (data.consumption) {
  //     const myList = Object.keys(data.consumption.timestamps).map((name) => {
  //       let consumptionValue = data.consumption.timestamps[name];
  //       let predictionValue = data.consumption.predictions[name];
  //       const cons: string = 'consumption';
  //       const pred: string = 'prediction';
  //       if (predictionValue == undefined) {
  //         predictionValue = 0.0;
  //       }
  //       if (consumptionValue == undefined) {
  //         consumptionValue = 0.0;
  //       }
  //       const series = [
  //         { name: cons, value: consumptionValue },
  //         { name: pred, value: predictionValue },
  //       ];
  //       return { name, series };
  //     });
  //     this.data = myList.map((item) => {
  //       const date = new Date(item.name);
  //       const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  //       return { name: dayName, series: item.series };
  //     });
  //   } else {
  //     this.data = [];
  //   }
  // }

  HistoryWeek(id: string) {
    this.show = true;
    this.spiner.show();
    this.deviceService.history7Days().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption.timestamps || {};
      const productionTimestamps = response.consumption.predictions || {};

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

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(193, 75, 72, 1)',
            borderColor: 'rgba(193, 75, 72, 0.5)',
          },
          {
            label: 'Prediction',
            data: productionData,
            backgroundColor: 'rgba(255, 125, 65, 1)',
            borderColor: 'rgba(255, 125, 65, 0.5)',
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvas'
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
      this.spiner.hide();
      this.show = false;
    });
  }

  HistoryMonth(id: string) {
    this.show = true;
    this.spiner.show();
    this.deviceService.history1Month().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption.timestamps || {};
      const productionTimestamps = response.consumption.predictions || {};

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

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(193, 75, 72, 1)',
            borderColor: 'rgba(193, 75, 72, 0.5)',
          },
          {
            label: 'Prediction',
            data: productionData,
            backgroundColor: 'rgba(255, 125, 65, 1)',
            borderColor: 'rgba(255, 125, 65, 0.5)',
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvas'
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
      this.spiner.hide();
      this.show = false;
    });
  }

  HistoryYear(id: string) {
    this.show = true;
    this.spiner.show();
    this.deviceService.history1Year().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption.timestamps || {};
      const productionTimestamps = response.consumption.predictions || {};

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

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(193, 75, 72, 1)',
            borderColor: 'rgba(193, 75, 72, 0.5)',
          },
          {
            label: 'Prediction',
            data: productionData,
            backgroundColor: 'rgba(255, 125, 65, 1)',
            borderColor: 'rgba(255, 125, 65, 1)',
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvas'
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
      this.spiner.hide();
      this.show = false;
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
