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

  tablePeriod : string = '';

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
    if(this.widthService.deviceWidth > this.widthService.height)
      grafik!.style!.minHeight = '500px';
    
    document.getElementById('prediction3')!.classList.add('active');
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
    XLSX.writeFile(workbook, 'Prediction_Table'+this.tablePeriod+'.xlsx');
  }

  ngOnInit(): void {
    document.getElementById('modalFadePredictionDataBody')!.style.maxHeight =
      this.widthService.height * 0.6 + 'px';

    if (
      this.widthService.deviceWidth >= 576 ||
      this.widthService.height >= this.widthService.deviceWidth * 2
    )
      this.coef = 0.55;

    this.PredictionWeek('prediction3');
    this.tablePeriod = '_Week';

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.coef = 0.6;
      if (
        this.widthService.deviceWidth >= 576 ||
        this.widthService.height >= this.widthService.deviceWidth * 2
      )
        this.coef = 0.55;
      const grafik = document.getElementById(
        'grafikPredictionConsumptionProduction'
      );
      grafik!.style!.height = this.widthService.height * this.coef + 'px';
    });
  }

  HistoryData(period: string, serviceFunction: any) {
    this.spiner1.show('spiner3');
    serviceFunction().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption || {};
      const productionTimestamps = response.production || {};

      const formatData = (data: any, period: string) => {
        return Object.keys(data).map((name) => {
          const date = new Date(name);
          let label = '';

          if (period === 'day') {
            const hours = date.getHours().toString().padStart(2, '0');
            label = `${hours}H`;
          } else {
            const dayNumber = date.getDate();
            const monthName = date.toLocaleString('default', { month: 'long' });
            label = `${monthName} ${dayNumber}`;
          }

          return {
            x: label,
            y: data[name] || 0.0,
          };
        });
      };

      const consumptionData = formatData(consumptionTimestamps, period);

      const productionData = formatData(productionTimestamps, period);

      this.data = [];

      if (consumptionData.length > 0) {
        this.data = [
          { type: 'consumption', values: consumptionData },

          { type: 'production', values: productionData },
        ];
      }

      if (this.data.length === 0) {
        this.spiner1.hide('spiner3');
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Predicted Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(255, 125, 65, 1)',
            borderColor: 'rgba(255, 125, 65, 1)',
          },
          {
            label: 'Predicted Production',
            data: productionData,
            backgroundColor: 'rgba(0, 188, 179, 1)',
            borderColor: 'rgba(0, 188, 179, 1)',
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
              title: {
                display: true,
                text: 'Electric Energy Prediction [kWh]',
                font: {
                  size: 18,
                  weight: 'bold',
                },
              },
            },
          },
          maintainAspectRatio: false,
        },
      });
      this.spiner1.hide('spiner3');
    });
  }

  Prediction1Day(id: string) {
    this.tablePeriod = '_1Day';
    this.HistoryData(
      'day',
      this.deviceService.prediction1Day.bind(this.deviceService)
    );
    this.activateButton(id);
  }

  Prediction3Days(id: string) {
    this.tablePeriod = '_3Days';
    this.HistoryData(
      'month',
      this.deviceService.prediction3Days.bind(this.deviceService)
    );
    this.activateButton(id);
  }
  PredictionWeek(id: string) {
    this.tablePeriod = '_Week';
    this.HistoryData(
      'week',
      this.deviceService.prediction1Week.bind(this.deviceService, this.id)
    );
    this.activateButton(id);
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
