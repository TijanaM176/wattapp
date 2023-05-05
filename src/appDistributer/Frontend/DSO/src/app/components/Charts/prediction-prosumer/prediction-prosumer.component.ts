import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/data.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import * as XLSX from 'xlsx';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-prediction-prosumer',
  templateUrl: './prediction-prosumer.component.html',
  styleUrls: ['./prediction-prosumer.component.css'],
})
export class PredictionProsumerComponent implements OnInit {
  id: string = '';
  data: any[] = [];
  dataConsumers: any = [];
  dataProducers: any = [];
  chart: any;
  show!: boolean;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ff7d41', '#00bcb3'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kW';

  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private spiner: NgxSpinnerService,
    private widthService: ScreenWidthService,
    private serviceData: TimestampService
  ) {}

  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    document.getElementById('predictionUserInfoCardBody')!.style.height =
      this.widthService.height * 0.6 + 'px';
    this.PredictionDay('predictionUser1');
    this.activateButton('predictionUser1');
    document.getElementById('modalFadePredictionProsumer')!.style.maxHeight =
      this.widthService.height * 0.7 + 'px';
  }

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  PredictionWeek(id: string) {
    this.show = true;
    this.spiner.show();
    this.serviceData
      .PredictionProsumer7Days(this.id)
      .subscribe((response: any) => {
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
              y: consumptionTimestamps[name] || 0.0,
            };
          }
        );

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
        this.spiner.hide();
        this.show = false;
      });
  }

  Prediction3Days(id: string) {
    this.show = true;
    this.spiner.show();
    this.serviceData
      .PredictionProsumer3Days(this.id)
      .subscribe((response: any) => {
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
              y: consumptionTimestamps[name] || 0.0,
            };
          }
        );

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
        this.spiner.hide();
        this.show = false;
      });
  }
  PredictionDay(id: string) {
    this.show = true;
    this.spiner.show();
    this.serviceData
      .PredictionProsumer1Day(this.id)
      .subscribe((response: any) => {
        const consumptionTimestamps = response.consumption || {};
        const productionTimestamps = response.production || {};

        const consumptionData = Object.keys(consumptionTimestamps).map(
          (name: any) => {
            const date = new Date(name);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return {
              x: `${hours}:${minutes}`,
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
              x: `${hours}:${minutes}`,
              y: productionTimestamps[name] || 0.0,
            };
          }
        );

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
        this.spiner.hide();
        this.show = false;
      });
  }
  exportTable(): void {
    const headerRow = [
      'Day',
      'Predicted Consumption (kW)',
      'Predicted Production (kW)',
    ];
    const sheetData = [
      headerRow,
      ...this.data.map((data: any) => [
        data.name,
        ...data.series.map((series: { value: number }) => series.value),
      ]),
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
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
