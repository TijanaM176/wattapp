import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimestampService } from 'src/app/services/timestamp.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import * as XLSX from 'xlsx';
import { Chart, registerables, ChartType } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-realizationPredictionAllProsumers',
  templateUrl: './realizationPredictionAllProsumers.component.html',
  styleUrls: ['./realizationPredictionAllProsumers.component.css'],
})
export class RealizationPredictionAllProsumersComponent implements OnInit {
  chart: any;
  id: string = '';
  data: any = ['z'];
  show!: boolean;
  activeChartType: ChartType = 'line';
  activePeriod: string = 'week';
  activeServiceFunction: any = this.servicetime.HistoryAllProsumers7Days.bind(
    this.servicetime
  );
  constructor(
    private spinner: NgxSpinnerService,
    private servicetime: TimestampService,
    private widthService: ScreenWidthService
  ) {}

  ngOnInit() {
    this.HistoryWeek('realizpred1');
    document.getElementById(
      'modalFadeRealizationPredictionAllProsumers'
    )!.style.maxHeight = this.widthService.height * 0.7 + 'px';
  }

  HistoryData(period: string, serviceFunction: any, chartType: ChartType) {
    this.activePeriod = period;
    this.activeServiceFunction = serviceFunction;
    this.activeChartType = chartType;
    this.show = true;
    this.spinner.show('spiner1');
    serviceFunction().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption.timestamps || {};
      const productionTimestamps = response.production.timestamps || {};
      const consumptionPredictions = response.consumption.predictions || {};
      const productionPredictions = response.production.predictions || {};

      const formatData = (data: any, period: string) => {
        return Object.keys(data).map((name) => {
          const date = new Date(name);
          let label = '';

          if (period === 'year') {
            label = date.toLocaleString('default', { month: 'long' });
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
      const consumptionPredictionData = formatData(
        consumptionPredictions,
        period
      );
      const productionData = formatData(productionTimestamps, period);

      const productionPredictionData = formatData(
        productionPredictions,
        period
      );

      this.data = [];

      if (productionData.length > 0 || consumptionData.length > 0) {
        this.data = [
          { type: 'consumption', values: consumptionData },

          { type: 'predictionConsumption', values: consumptionPredictionData },
          { type: 'production', values: productionData },
          { type: 'predictionProduction', values: productionPredictionData },
        ];
      }

      if (this.data.length === 0) {
        this.spinner.hide('spiner1');
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(212, 43, 17, 1)',
            borderColor: 'rgba(212, 43, 17, 0.75)',
          },
          {
            label: 'Predicted Consumption',
            data: consumptionPredictionData,
            backgroundColor: 'rgba(242, 103, 17, 1)',
            borderColor: 'rgba(242, 103, 17, 0.75)',
          },
          {
            label: 'Production',
            data: productionData,
            backgroundColor: 'rgba(2, 150, 39, 1)',
            borderColor: 'rgba(2, 150, 39, 0.75)',
          },
          {
            label: 'Predicted Production',
            data: productionPredictionData,
            backgroundColor: 'rgba(0, 188, 179, 1)',
            borderColor: 'rgba(0, 188, 179, 0.75)',
            borderDash: [5, 5],
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvasHistoryPredictionAll'
      ) as HTMLElement;
      if (this.chart) {
        this.chart.destroy();
      }

      const chart2d = chartElement.getContext('2d');
      this.chart = new Chart(chart2d, {
        type: chartType,
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Energy (kWh)',
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

      this.spinner.hide('spiner1');
      this.show = false;
    });
  }

  HistoryWeek(id: string) {
    this.activateButton(id);
    this.HistoryData(
      'week',
      this.servicetime.HistoryAllProsumers7Days.bind(this.servicetime),
      this.activeChartType
    );
    this.activateButton(id);
  }

  HistoryMonth(id: string) {
    this.activateButton(id);
    this.HistoryData(
      'month',
      this.servicetime.HistoryAllProsumers1Month.bind(this.servicetime),
      this.activeChartType
    );
    this.activateButton(id);
  }

  HistoryYear(id: string) {
    this.activateButton(id);
    this.HistoryData(
      'year',
      this.servicetime.HistoryAllProsumers1Year.bind(this.servicetime),
      this.activeChartType
    );
    this.activateButton(id);
  }

  exportTable(data: any[]): void {
    const headerRow = [
      '',
      'Consumption (kWh)',
      'Prediction for Consumption (kWh)',
      'Production (kWh)',
      'Prediction for Production (kWh)',
    ];
    const sheetData = [headerRow];

    const maxLength = Math.max(
      data[0]?.values.length,
      data[1]?.values.length,
      data[2]?.values.length,
      data[3]?.values.length
    );

    for (let i = 0; i < maxLength; i++) {
      const value = data[0]?.values[i];
      const consumptionPrediction = data[1]?.values[i];
      const production = data[2]?.values[i];
      const productionPrediction = data[3]?.values[i];

      const row = [
        value ? value.x : '',
        value ? value.y.toFixed(2) : '0',
        consumptionPrediction ? consumptionPrediction.y.toFixed(2) : '0',
        production ? production.y.toFixed(2) : '0',
        productionPrediction ? productionPrediction.y.toFixed(2) : '0',
      ];

      sheetData.push(row);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }
  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.realizationpredictionbtn');
    buttons.forEach((button) => {
      if (button.id == buttonNumber) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
