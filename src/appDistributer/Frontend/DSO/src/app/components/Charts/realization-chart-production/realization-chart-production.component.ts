import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Color,
  ColorHelper,
  LegendPosition,
  ScaleType,
} from '@swimlane/ngx-charts';
import * as XLSX from 'xlsx';

import { fromEvent, Observable, Subscription } from 'rxjs';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-realization-chart-production',
  templateUrl: './realization-chart-production.component.html',
  styleUrls: ['./realization-chart-production.component.css'],
})
export class RealizationChartProductionComponent
  implements OnInit, AfterViewInit
{
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
    domain: ['#238f91', '#d3f72f'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy  ( kWh )';

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  coef: number = 0.6;
  id!: string;
  show!: boolean;

  constructor(
    private deviceService: DeviceserviceService,
    private widthService: ScreenWidthService,
    private serviceTime: TimestampService,
    private router: ActivatedRoute,
    private service: UsersServiceService,
    private spiner: NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    const grafik = document.getElementById('realizationUser');
    grafik!.style.height = this.widthService.height * this.coef + 'px';
    // document.getElementById('realizPred1')!.classList.add("active");
  }

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.HistoryWeek('realizPred1');
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
      const grafik = document.getElementById('realizationUser');
      grafik!.style.height = this.widthService.height * this.coef + 'px';
    });
    document.getElementById(
      'modalFadeProductionHistoryProsumer'
    )!.style.maxHeight = this.widthService.height * 0.7 + 'px';
  }

  exportTable(data: any[]): void {
    const headerRow = [
      '',
      'Energy Production (kW)',
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

  HistoryWeek(id: string) {
    this.show = true;
    this.spiner.show();
    this.serviceTime
      .HistoryProsumer7Days(this.id)
      .subscribe((response: any) => {
        const consumptionTimestamps = response.production.timestamps || {};
        const productionTimestamps = response.production.predictions || {};

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
          this.activateButton(id);
          this.spiner.hide();
          this.show = false;
          return;
        }

        const chartData = {
          datasets: [
            {
              label: 'Consumption',
              data: consumptionData,
              backgroundColor: 'rgba(128, 188, 0, 1)',
              borderColor: 'rgba(128, 188, 0, 0.5)',
            },
            {
              label: 'Prediction',
              data: productionData,
              backgroundColor: 'rgba(0, 188, 179, 1)',
              borderColor: 'rgba(0, 188, 179, 0.5)',
            },
          ],
        };

        const chartElement: any = document.getElementById(
          'chartCanvasProduction'
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
    this.serviceTime
      .HistoryProsumer1Month(this.id)
      .subscribe((response: any) => {
        const consumptionTimestamps = response.production.timestamps || {};
        const productionTimestamps = response.production.predictions || {};

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
          this.activateButton(id);
          this.spiner.hide();
          this.show = false;
          return;
        }

        const chartData = {
          datasets: [
            {
              label: 'Consumption',
              data: consumptionData,
              backgroundColor: 'rgba(128, 188, 0, 1)',
              borderColor: 'rgba(128, 188, 0, 0.5)',
            },
            {
              label: 'Prediction',
              data: productionData,
              backgroundColor: 'rgba(0, 188, 179, 1)',
              borderColor: 'rgba(0, 188, 179, 0.5)',
            },
          ],
        };

        const chartElement: any = document.getElementById(
          'chartCanvasProduction'
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
    this.serviceTime
      .HistoryProsumer1Year(this.id)
      .subscribe((response: any) => {
        const consumptionTimestamps = response.production.timestamps || {};
        const productionTimestamps = response.production.predictions || {};

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

        const chartData = {
          datasets: [
            {
              label: 'Consumption',
              data: consumptionData,
              backgroundColor: 'rgba(128, 188, 0, 1)',
              borderColor: 'rgba(128, 188, 0, 0.5)',
            },
            {
              label: 'Prediction',
              data: productionData,
              backgroundColor: 'rgba(0, 188, 179, 1)',
              borderColor: 'rgba(0, 188, 179, 0.5)',
            },
          ],
        };
        productionData[0]
          ? (this.data = [
              { type: 'consumption', values: consumptionData },
              { type: 'production', values: productionData },
            ])
          : (this.data = []);

        if (this.data.length == 0) {
          this.activateButton(id);
          this.spiner.hide();
          this.show = false;
          return;
        }

        const chartElement: any = document.getElementById(
          'chartCanvasProduction'
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
