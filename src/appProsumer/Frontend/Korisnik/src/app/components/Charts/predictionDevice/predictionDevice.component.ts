import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';

@Component({
  selector: 'app-predictionDevice',
  templateUrl: './predictionDevice.component.html',
  styleUrls: ['./predictionDevice.component.css'],
})
export class PredictionDeviceComponent implements OnInit {
  data: any[] = [];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#d96d2a', '#2a96d9'],
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
  cat: string = '';

  constructor(
    private deviceService: DevicesService,
    private widthService: DeviceWidthService,
    private router1: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    const grafik = document.getElementById('predikcija');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    this.Prediction1Day('prediction1');
    //document.getElementById("prediction3")!.classList.add('active');
  }

  yAxisTickFormatting(value: number) {
    return value + ' kW';
  }

  getWeek(date: Date): number {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(
      ((date.getTime() - oneJan.getTime()) / millisecsInDay +
        oneJan.getDay() +
        1) /
        7
    );
  }

  PredictionWeek(id: string) {
    this.deviceService
      .predictionDevice(this.idDev)
      .subscribe((response: any) => {
        this.cat = response.categoryId;
        const myList = Object.keys(response.nextWeek.PredictionsFor7day).map(
          (name) => {
            let predictionValue = response.nextWeek.PredictionsFor7day[name];
            const cons: string = 'consumption';
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
      });
  }

  Prediction3Days(id: string) {
    this.deviceService
      .predictionDevice(this.idDev)
      .subscribe((response: any) => {
        this.cat = response.categoryId;
        const myList = Object.keys(response.next3Day.PredictionsFor3day).map(
          (name) => {
            let predictionValue = response.next3Day.PredictionsFor3day[name];
            const cons: string = 'consumption';
            const prod: string = 'producton';
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
      });
  }

  Prediction1Day(id: string) {
    this.deviceService
      .predictionDevice(this.idDev)
      .subscribe((response: any) => {
        this.cat = response.categoryId;
        const myList = Object.keys(response.nextDay.PredictionsFor1day).map(
          (name) => {
            let predictionValue = response.nextDay.PredictionsFor1day[name];
            const cons: string = 'consumption';
            const prod: string = 'producton';
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
      });
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
