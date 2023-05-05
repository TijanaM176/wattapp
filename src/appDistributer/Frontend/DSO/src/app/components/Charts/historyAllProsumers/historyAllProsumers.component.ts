import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendComponent } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimestampService } from 'src/app/services/timestamp.service';
import { tickStep } from 'd3';
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
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showsp!: boolean;
  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private servicetime: TimestampService,
    private spiner: NgxSpinnerService,
    private widthService: ScreenWidthService
  ) {}

  exportTable(): void {
    const headerRow = ['Day', 'Consumption (kW)', 'Production (kW)'];
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

  ngOnInit() {
    this.HistoryWeek('bttn1');
    document.getElementById('modalFadeHistoryAllProsumers')!.style.maxHeight =
      this.widthService.height * 0.7 + 'px';
  }

  HistoryWeek(id: string) {
    this.spiner.show();
    this.servicetime.HistoryAllProsumers7Days().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption.timestamps || {};
      const productionTimestamps = response.production.timestamps || {};

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
        this.spiner.hide();
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Energy Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(193, 75, 72, 1)',
            borderColor: 'rgba(193, 75, 72, 0.5)',
          },
          {
            label: 'Energy Production',
            data: productionData,
            backgroundColor: 'rgba(128, 188, 0, 1)',
            borderColor: 'rgba(128, 188, 0, 0.5)',
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
            },
          },
          maintainAspectRatio: false,
        },
      });

      this.spiner.hide();
    });
  }

  HistoryMonth(id: string) {
    this.spiner.show();
    this.servicetime.HistoryAllProsumers1Month().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption.timestamps || {};
      const productionTimestamps = response.production.timestamps || {};

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
        this.spiner.hide();
        return;
      }

      const chartData = {
        datasets: [
          {
            label: 'Energy Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(193, 75, 72, 1)',
            borderColor: 'rgba(193, 75, 72, 0.5)',
          },
          {
            label: 'Energy Production',
            data: productionData,
            backgroundColor: 'rgba(128, 188, 0, 1)',
            borderColor: 'rgba(128, 188, 0, 0.5)',
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
            },
          },
          maintainAspectRatio: false,
        },
      });

      this.spiner.hide();
    });
  }

  HistoryYear(id: string) {
    this.spiner.show();
    this.servicetime.HistoryAllProsumers1Year().subscribe((response: any) => {
      const consumptionTimestamps = response.consumption.timestamps || {};
      const productionTimestamps = response.production.timestamps || {};

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
            label: 'Energy Consumption',
            data: consumptionData,
            backgroundColor: 'rgba(193, 75, 72, 1)',
            borderColor: 'rgba(193, 75, 72, 0.5)',
          },
          {
            label: 'Energy Production',
            data: productionData,
            backgroundColor: 'rgba(128, 188, 0, 1)',
            borderColor: 'rgba(128, 188, 0, 0.5)',
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
        return;
      }

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
            },
          },
          maintainAspectRatio: false,
        },
      });

      this.activateButton(id);
      this.spiner.hide();
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
