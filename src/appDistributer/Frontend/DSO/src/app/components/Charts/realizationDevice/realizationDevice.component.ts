import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-realizationDevice',
  templateUrl: './realizationDevice.component.html',
  styleUrls: ['./realizationDevice.component.css'],
})
export class RealizationDeviceComponent implements OnInit, AfterViewInit {
  chart: any;
  data: any[] = ['z'];
  idDev: string = '';
  show!: boolean;
  @Input() type: string = '';

  constructor(
    private widthService: ScreenWidthService,
    private timeService: TimestampService,
    private router1: ActivatedRoute,
    private spiner: NgxSpinnerService
  ) {}

  exportTable(): void {
    let headerRow: any = [];
    if (this.type === 'Consumption') {
      headerRow = ['', 'Consumption', 'Predicted Consumption (kW)'];
    } else {
      headerRow = ['', 'Production', 'Predicted Production (kW)'];
    }

    const sheetData = [headerRow];
    for (let i = 0; i < this.data[0].values.length; i++) {
      const rowData = [this.data[0].values[i].x];

      const consumptionValue = this.data[0].values[i].y.toFixed(2);
      const predictedValue = this.data[1].values[i].y.toFixed(2);
      rowData.push(consumptionValue);
      rowData.push(predictedValue);

      sheetData.push(rowData);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }

  ngAfterViewInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    const grafik = document.getElementById('RealizationDevice');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    document.getElementById('realiz1')!.classList.add('active');
    this.HistoryWeek('realiz1');
  }

  ngOnInit(): void {
    const grafik = document.getElementById('RealizationDevice');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    document.getElementById('realiz1')!.classList.add('active');
    this.idDev = this.router1.snapshot.params['idDev'];
    document.getElementById('modalFadeHistoryDevice')!.style.maxHeight =
      this.widthService.height * 0.7 + 'px';
    this.HistoryWeek('realiz1');
  }

  HistoryData(period: string, serviceFunction: any) {
    this.show = true;
    this.spiner.show();
    serviceFunction().subscribe((response: any) => {
      const consumptionTimestamps = response.timestamps || {};
      const productionTimestamps = response.predictions || {};

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

      if (this.data.length === 0) {
        this.show = false;
        this.spiner.hide();
        return;
      }
      let backgroundColor, borderColor, backgroundColor1, borderColor1;
      if (this.type === 'Consumption') {
        backgroundColor = 'rgba(193, 75, 72, 1)';
        borderColor = 'rgba(193, 75, 72, 1)';
        backgroundColor1 = 'rgba(255, 125, 65, 1)';
        borderColor1 = 'rgba(255, 125, 65,1)';
      } else if (this.type === 'Production') {
        backgroundColor = 'rgba(128, 188, 0, 1)';
        borderColor = 'rgba(128, 188, 0, 1)';
        backgroundColor1 = 'rgba(0, 188, 179, 1)';
        borderColor1 = 'rgba(0, 188, 179, 1)';
      }

      const chartData = {
        datasets: [
          {
            label: `${this.type}`,
            data: consumptionData,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
          },
          {
            label: `Predicted ${this.type}`,
            data: productionData,
            backgroundColor: backgroundColor1,
            borderColor: borderColor1,
          },
        ],
      };

      const chartElement: any = document.getElementById(
        'RealizationDeviceChart'
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
    });
    this.spiner.hide();
    this.show = false;
  }

  HistoryWeek(id: string) {
    this.spiner.show();
    this.HistoryData(
      'week',
      this.timeService.historyDeviceWeek.bind(this.timeService, this.idDev)
    );
    this.activateButton(id);
  }

  HistoryMonth(id: string) {
    this.HistoryData(
      'month',
      this.timeService.historyDeviceMonth.bind(this.timeService, this.idDev)
    );
    this.activateButton(id);
  }

  HistoryYear(id: string) {
    this.HistoryData(
      'year',
      this.timeService.historyDeviceYear.bind(this.timeService, this.idDev)
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
