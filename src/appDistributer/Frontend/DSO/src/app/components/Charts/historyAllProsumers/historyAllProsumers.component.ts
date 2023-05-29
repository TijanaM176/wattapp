import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimestampService } from 'src/app/services/timestamp.service';
import * as XLSX from 'xlsx';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-historyAllProsumers',
  templateUrl: './historyAllProsumers.component.html',
  styleUrls: ['./historyAllProsumers.component.css'],
})
export class HistoryAllProsumersComponent implements OnInit {
  chart: any;
  production = true;
  consumption = true;
  id: string = '';
  data: any[] = ['z'];
  showsp!: boolean;

  tablePeriod : string = '';

  constructor(
    private servicetime: TimestampService,
    private spiner: NgxSpinnerService,
    private widthService: ScreenWidthService
  ) {}

  exportTable(data: any[]): void {
    const headerRow = ['', 'Energy Consumption (kW)', 'Energy Production (kW)'];
    const sheetData = [headerRow];

    const maxLength = Math.max(data[0]?.values.length, data[1]?.values.length);

    for (let i = 0; i < maxLength; i++) {
      const consumptionValue = data[0]?.values[i];
      const productionValue = data[1]?.values[i];

      const row = [
        consumptionValue ? consumptionValue.x : '',
        consumptionValue ? consumptionValue.y.toFixed(2) : '0',
        productionValue ? productionValue.y.toFixed(2) : '0',
      ];

      sheetData.push(row);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'Consumption_Production_History_Table_'+this.tablePeriod+'.xlsx');
  }

  ngOnInit() {
    this.HistoryWeek('realiz1');
    this.tablePeriod = 'Week_';
    document.getElementById('modalFadeHistoryAllProsumers')!.style.maxHeight =
      this.widthService.height * 0.7 + 'px';
  }

  HistoryData(period: string, serviceFunction: any) {
    this.spiner.show('spiner2');
    serviceFunction().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption.timestamps || {};
      const productionTimestamps = response.production.timestamps || {};

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

      const productionData = formatData(productionTimestamps, period);

      this.data = [];

      if (consumptionData.length > 0) {
        this.data = [
          { type: 'consumption', values: consumptionData },

          { type: 'production', values: productionData },
        ];
      }
      // console.log(this.data);

      if (this.data.length === 0) {
        this.spiner.hide('spiner2');
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(193, 75, 72, 1)',
            borderColor: 'rgba(193, 75, 72, 1)',
          },
          {
            label: 'Production',
            data: productionData,
            backgroundColor: 'rgba(128, 188, 0, 1)',
            borderColor: 'rgba(128, 188, 0, 1)',
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'chartCanvasHistoryAll'
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
      this.spiner.hide('spiner2');
    });
  }

  HistoryWeek(id: string) {
    this.tablePeriod = 'Week_';
    this.HistoryData(
      'week',
      this.servicetime.HistoryAllProsumers7Days.bind(this.servicetime)
    );
    this.activateButton(id);
  }

  HistoryMonth(id: string) {
    this.tablePeriod = 'Month_';
    this.HistoryData(
      'month',
      this.servicetime.HistoryAllProsumers1Month.bind(this.servicetime)
    );
    this.activateButton(id);
  }

  HistoryYear(id: string) {
    this.tablePeriod = 'Year_';
    this.HistoryData(
      'year',
      this.servicetime.HistoryAllProsumers1Year.bind(this.servicetime)
    );
    this.activateButton(id);
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
