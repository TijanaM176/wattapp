import { Component, OnInit } from '@angular/core';
import { TimestampService } from 'src/app/services/timestamp.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-PredictionAllUsers',
  templateUrl: './PredictionAllUsers.component.html',
  styleUrls: ['./PredictionAllUsers.component.css'],
})
export class PredictionAllUsersComponent implements OnInit {
  chart: any;
  production = true;
  consumption = true;
  id: string = '';
  data: any[] = ['z'];
  show!: boolean;

  tablePeriod : string = '';

  constructor(
    private servicetime: TimestampService,
    private spiner: NgxSpinnerService,
    private widthService: ScreenWidthService
  ) {}

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
    XLSX.writeFile(
      workbook,
      'Predicted_Consumption_Production_Prediction_Table_'+this.tablePeriod+'.xlsx'
    );
  }

  ngOnInit() {
    this.PredictionDay('pred1');
    this.tablePeriod = '1Day_';
    document.getElementById(
      'modalFadePredictionAllProsumers'
    )!.style.maxHeight = this.widthService.height * 0.7 + 'px';
  }

  HistoryData(period: string, serviceFunction: any) {
    this.spiner.show('spiner3');
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
        this.show = false;
        this.spiner.hide('spiner3');
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Predicted Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(242, 103, 17, 1)',
            borderColor: 'rgba(242, 103, 17, 0.75)',
          },
          {
            label: 'Predicted Production',
            data: productionData,
            backgroundColor: 'rgba(0, 188, 179, 1)',
            borderColor: 'rgba(0, 188, 179, 0.75)',
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvasPredictionAll'
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
      this.spiner.hide('spiner3');
    });
  }

  PredictionDay(id: string) {
    this.tablePeriod = '1Day_';
    this.HistoryData(
      'day',
      this.servicetime.PredictionNextDay.bind(this.servicetime, this.id)
    );
    this.activateButton(id);
  }

  Prediction3Days(id: string) {
    this.tablePeriod = '3Days_';
    this.HistoryData(
      'week',
      this.servicetime.PredictionNext3Days.bind(this.servicetime, this.id)
    );
    this.activateButton(id);
  }

  PredictionWeek(id: string) {
    this.tablePeriod = 'Week_';
    this.HistoryData(
      'week',
      this.servicetime.PredictionNextWeek.bind(this.servicetime, this.id)
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
