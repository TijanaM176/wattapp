import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { ScaleType, Color, LegendPosition } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimestampService } from 'src/app/services/timestamp.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import * as XLSX from 'xlsx';

import { UsersServiceService } from 'src/app/services/users-service.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-history-Prosumer',
  templateUrl: './history-Prosumer.component.html',
  styleUrls: ['./history-Prosumer.component.css'],
})
export class HistoryProsumerComponent implements OnInit {
  data: any[] = ['z'];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  chart: any;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#c14b48', '#80BC00'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kWh';

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

  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    document.getElementById('grafik')!.style.height =
      this.widthService.height * this.coef + 'px';
    this.HistoryWeek('realiz2');
    document.getElementById(
      'modalFadeConsumptionHistoryProsumer'
    )!.style.maxHeight = this.widthService.height * 0.7 + 'px';
  }
  HistoryWeek(id: string) {
    this.show = true;
    this.spiner.show();
    this.serviceTime
      .HistoryProsumer7Days(this.id)
      .subscribe((response: any) => {
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
        console.log(this.data);

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
    this.serviceTime
      .HistoryProsumer1Month(this.id)
      .subscribe((response: any) => {
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
    this.serviceTime
      .HistoryProsumer1Year(this.id)
      .subscribe((response: any) => {
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
