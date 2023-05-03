import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-predictionDevice',
  templateUrl: './predictionDevice.component.html',
  styleUrls: ['./predictionDevice.component.css'],
})
export class PredictionDeviceComponent implements OnInit, AfterViewInit {
  data: any[] = [];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#F4C430'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kWh';
  idDev: string = '';
  show!: boolean;
  @Input() type: string = '';

  constructor(
    private deviceService: DeviceserviceService,
    private widthService: ScreenWidthService,
    private timeService: TimestampService,
    private router1: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  exportTable(): void {
    let headerRow: any = [];
    if (this.type == 'Consumption')
      headerRow = ['Day', 'Predicted Consumption (kW)'];
    else headerRow = ['Day', 'Predicted Production (kW)'];

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

  ngAfterViewInit(): void {
    const grafik = document.getElementById('predikcija');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    this.Prediction1Day('predictionDevice1');
  }

  ngOnInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    const grafik = document.getElementById('predikcija');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    this.Prediction1DayInit('predictionDevice1');
    document.getElementById('modalFadePredictionDevice')!.style.maxHeight =
      this.widthService.height * 0.7 + 'px';
    this.Prediction1Day('predictionDevice1');
  }

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  PredictionWeek(id: string) {
    this.show = true;
    this.spinner.show();
    this.timeService.predictionDevice(this.idDev).subscribe((response: any) => {
      // console.log(response);
      const myList = Object.keys(response.nextWeek.PredictionsFor7day).map(
        (name) => {
          let predictionValue = response.nextWeek.PredictionsFor7day[name];
          const cons: string = this.type.toLowerCase();
          if (predictionValue == undefined) {
            predictionValue = 0.0;
          }
          const series = [{ name: cons, value: predictionValue }];
          const date = new Date(name);
          const formattedName = date.toLocaleDateString('en-US', {
            weekday: 'long',
          });
          return { name: formattedName, series };
        }
      );
      this.data = myList;
      this.activateButton(id);
      this.spinner.hide();
      this.show = false;
      // console.log(this.data);
    });
  }

  Prediction3Days(id: string) {
    this.show = true;
    this.spinner.show();
    this.timeService.predictionDevice(this.idDev).subscribe((response: any) => {
      const myList = Object.keys(response.next3Day.PredictionsFor3day).map(
        (name) => {
          let predictionValue = response.next3Day.PredictionsFor3day[name];
          const cons: string = this.type.toLowerCase();
          if (predictionValue == undefined) {
            predictionValue = 0.0;
          }
          const series = [{ name: cons, value: predictionValue }];
          const date = new Date(name);
          const formattedName = date.toLocaleDateString('en-US', {
            weekday: 'long',
          });
          return { name: formattedName, series };
        }
      );
      this.data = myList;
      this.activateButton(id);
      this.spinner.hide();
      this.show = false;
      // console.log(this.data);
    });
  }

  Prediction1Day(id: string) {
    this.show = true;
    this.spinner.show();
    this.timeService.predictionDevice(this.idDev).subscribe((response: any) => {
      const myList = Object.keys(response.nextDay.PredictionsFor1day).map(
        (name) => {
          let predictionValue = response.nextDay.PredictionsFor1day[name];
          const cons: string = this.type.toLowerCase();
          if (predictionValue == undefined) {
            predictionValue = 0.0;
          }
          const series = [{ name: cons, value: predictionValue }];
          const date = new Date(name);
          const formattedHour = date.toLocaleTimeString([], {
            hour: '2-digit',
          });
          const formattedName = formattedHour.split(':')[0] + 'H';
          return { name: formattedName, series };
        }
      );
      this.data = myList;
      this.activateButton(id);
      this.spinner.hide();
      this.show = false;
      // console.log(this.data);
    });
  }
  Prediction1DayInit(id: string) {
    this.timeService.predictionDevice(this.idDev).subscribe((response: any) => {
      const myList = Object.keys(response.nextDay.PredictionsFor1day).map(
        (name) => {
          let predictionValue = response.nextDay.PredictionsFor1day[name];
          const cons: string = this.type.toLowerCase();
          if (predictionValue == undefined) {
            predictionValue = 0.0;
          }
          const series = [{ name: cons, value: predictionValue }];
          const date = new Date(name);
          const formattedHour = date.toLocaleTimeString([], {
            hour: '2-digit',
          });
          const formattedName = formattedHour.split(':')[0] + 'H';
          return { name: formattedName, series };
        }
      );
      this.data = myList;
      this.activateButton(id);
      // console.log(this.data);
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
