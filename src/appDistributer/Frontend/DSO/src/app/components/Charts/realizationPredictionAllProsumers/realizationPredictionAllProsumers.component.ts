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

  tablePeriod: string = '';

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
    this.tablePeriod = 'Week_';
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
      console.log(this.data);

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(193, 75, 72, 1)',
            borderColor: 'rgba(193, 75, 72, 1)',
          },
          {
            label: 'Predicted Consumption',
            data: consumptionPredictionData,
            backgroundColor: 'rgba(217, 109, 42,1)',
            borderColor: 'rgba(217, 109, 42,1)',
            // borderDash: [5, 5],
          },
          {
            label: 'Production',
            data: productionData,
            backgroundColor: 'rgba(128, 188, 0, 1)',
            borderColor: 'rgba(128, 188, 0, 1)',
          },
          {
            label: 'Predicted Production',
            data: productionPredictionData,
            backgroundColor: 'rgba(0, 188, 179, 1)',
            borderColor: 'rgba(0, 188, 179, 1)',
            // borderDash: [5, 5],
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
                text: 'Electric Energy [kWh]',
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
    this.tablePeriod = 'Week_';
    this.activateButton(id);
    this.HistoryData(
      'week',
      this.servicetime.HistoryPrediction3Days.bind(this.servicetime),
      this.activeChartType
    );
    this.activateButton(id);
  }

  HistoryMonth(id: string) {
    this.tablePeriod = 'Month_';
    this.activateButton(id);
    this.HistoryData(
      'month',
      this.servicetime.HistoryAllProsumers1Month.bind(this.servicetime),
      this.activeChartType
    );
    this.activateButton(id);
  }

  HistoryYear(id: string) {
    this.tablePeriod = 'Year_';
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

    const consumptionPredictionValues = data[1]?.values;
    if (consumptionPredictionValues) {
      consumptionPredictionValues.forEach((value: any) => {
        const consumption = data[0]?.values.find(
          (item: any) => item.x === value.x
        );
        const production = data[2]?.values.find(
          (item: any) => item.x === value.x
        );
        const productionPrediction = data[3]?.values.find(
          (item: any) => item.x === value.x
        );

        const row = [
          value.x,
          consumption ? consumption.y.toFixed(2) : '0',
          value.y.toFixed(2),
          production ? production.y.toFixed(2) : '0',
          productionPrediction ? productionPrediction.y.toFixed(2) : '0',
        ];

        sheetData.push(row);
      });
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(
      workbook,
      'Realization_and_Prediction_Table_' + this.tablePeriod + '.xlsx'
    );
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
