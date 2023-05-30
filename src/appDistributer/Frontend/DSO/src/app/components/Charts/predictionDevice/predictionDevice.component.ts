import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-predictionDevice',
  templateUrl: './predictionDevice.component.html',
  styleUrls: ['./predictionDevice.component.css'],
})
export class PredictionDeviceComponent implements OnInit, AfterViewInit {
  chart: any;
  data: any[] = ['z'];
  idDev: string = '';
  show!: boolean;
  @Input() type: string = '';

  prosumerUsername : string = '';
  deviceName : string = '';
  tablePeriod : string = '';

  constructor(
    private widthService: ScreenWidthService,
    private timeService: TimestampService,
    private router1: ActivatedRoute,
    private spiner: NgxSpinnerService
  ) {}

  exportTable(): void {
    let headerRow: any = [];
    if (this.type === 'Consumption') {
      headerRow = ['', 'Predicted Consumption (kW)'];
    } else {
      headerRow = ['', 'Predicted Production (kW)'];
    }

    const sheetData = [headerRow];
    for (let i = 0; i < this.data[0].values.length; i++) {
      const rowData = [this.data[0].values[i].x];

      const consumptionValue = this.data[0].values[i].y.toFixed(5);
      rowData.push(consumptionValue);

      sheetData.push(rowData);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(
      workbook,
      this.type + 'Prediction_for_' + this.type + '_Table_'+this.tablePeriod+this.deviceName+'_'+this.prosumerUsername+'.xlsx'
    );
  }

  ngAfterViewInit(): void {
    const grafik = document.getElementById('predikcija');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    this.Prediction1Day('predictionDevice1');
  }

  ngOnInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    const grafik = document.getElementById('predikcija');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    this.Prediction1Day('predictionDevice1');
    document.getElementById('modalFadePredictionDevice')!.style.maxHeight =
      this.widthService.height * 0.7 + 'px';
    this.Prediction1Day('predictionDevice1');
    this.tablePeriod = '1Day_';
  }

  PredictionWeek(id: string) {
    this.tablePeriod = 'Week_';
    this.show = true;
    this.spiner.show();
    this.activateButton(id);
    this.timeService.predictionDevice(this.idDev).subscribe({
      next: (response) => {
        const consumptionTimestamps =
          response.nextWeek.PredictionsFor7day || {};

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
        this.data = [{ type: 'consumption', values: consumptionData }];

        let backgroundColor, borderColor;
        if (this.type === 'Consumption') {
          backgroundColor = 'rgba(255, 125, 65, 1)';
          borderColor = 'rgba(255, 125, 65,0.75)';
        } else if (this.type === 'Production') {
          backgroundColor = 'rgba(0, 188, 179, 1)';
          borderColor = 'rgba(0, 188, 179, 0.75)';
        } else {
          backgroundColor = 'rgba(0, 150, 179, 1)';
          borderColor = 'rgba(0, 150, 179, 0.75)';
        }

        const chartData = {
          datasets: [
            {
              label: 'Predicted ' + this.type,
              data: consumptionData,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            },
          ],
        };

        const chartElement: any = document.getElementById(
          'chartDevicePrediction'
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

        this.spiner.hide();
        this.show = false;
      },
      error: (err) => {
        console.log(err);
        this.data = [];
        this.spiner.hide();
        this.show = false;
      },
    });
  }

  Prediction3Days(id: string) {
    this.tablePeriod = '3Days_';
    this.show = true;
    this.spiner.show();
    this.timeService.predictionDevice(this.idDev).subscribe({
      next: (response) => {
        const consumptionTimestamps =
          response.next3Day.PredictionsFor3day || {};

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
        this.data = [{ type: 'consumption', values: consumptionData }];

        let backgroundColor, borderColor;
        if (this.type === 'Consumption') {
          backgroundColor = 'rgba(255, 125, 65, 1)';
          borderColor = 'rgba(255, 125, 65,0.75)';
        } else if (this.type === 'Production') {
          backgroundColor = 'rgba(0, 188, 179, 1)';
          borderColor = 'rgba(0, 188, 179, 0.75)';
        } else {
          backgroundColor = 'rgba(0, 150, 179, 1)';
          borderColor = 'rgba(0, 150, 179, 0.75)';
        }

        const chartData = {
          datasets: [
            {
              label: 'Predicted ' + this.type,
              data: consumptionData,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            },
          ],
        };

        const chartElement: any = document.getElementById(
          'chartDevicePrediction'
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

        this.activateButton(id);
        this.spiner.hide();
        this.show = false;
      },
      error: (err) => {
        console.log(err);
        this.data = [];
        this.spiner.hide();
        this.show = false;
      },
    });
  }

  Prediction1Day(id: string) {
    this.tablePeriod = '1Day_';
    this.show = true;
    this.spiner.show();
    this.timeService.predictionDevice(this.idDev).subscribe({
      next: (response) => {
        const consumptionTimestamps = response.nextDay.PredictionsFor1day || {};

        const consumptionData = Object.keys(consumptionTimestamps).map(
          (name: any) => {
            const date = new Date(name);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return {
              x: `${hours}:${minutes}H`,
              y: consumptionTimestamps[name] || 0.0,
            };
          }
        );
        this.data = [{ type: 'consumption', values: consumptionData }];

        let backgroundColor, borderColor;
        if (this.type === 'Consumption') {
          backgroundColor = 'rgba(255, 125, 65, 1)';
          borderColor = 'rgba(255, 125, 65,0.75)';
        } else if (this.type === 'Production') {
          backgroundColor = 'rgba(0, 188, 179, 1)';
          borderColor = 'rgba(0, 188, 179, 0.75)';
        } else {
          backgroundColor = 'rgba(0, 150, 179, 1)';
          borderColor = 'rgba(0, 150, 179, 0.75)';
        }

        const chartData = {
          datasets: [
            {
              label: 'Predicted ' + this.type,
              data: consumptionData,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            },
          ],
        };

        const chartElement: any = document.getElementById(
          'chartDevicePrediction'
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

        this.activateButton(id);
        this.spiner.hide();
        this.show = false;
      },
      error: (err) => {
        console.log(err);
        this.data = [];
        this.spiner.hide();
        this.show = false;
      },
    });
  }
  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.predictionDeviceBtns');
    buttons.forEach((button) => {
      if (button.id == buttonNumber) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
