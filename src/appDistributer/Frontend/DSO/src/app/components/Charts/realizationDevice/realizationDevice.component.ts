import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Color,
  ColorHelper,
  LegendPosition,
  ScaleType,
} from '@swimlane/ngx-charts';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { TimestampService } from 'src/app/services/timestamp.service';

@Component({
  selector: 'app-realizationDevice',
  templateUrl: './realizationDevice.component.html',
  styleUrls: ['./realizationDevice.component.css'],
})
export class RealizationDeviceComponent implements OnInit, AfterViewInit {
  data: any[] = [];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF414E', '#F4C430'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kWh';
  idDev: string = '';
  @Input() type : string = '';

  constructor(
    private deviceService: DeviceserviceService,
    private widthService: ScreenWidthService,
    private timeService: TimestampService,
    private router1: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
    const grafik = document.getElementById('grafik');
    grafik!.style.height = this.widthService.height * 0.6 + 'px';
    document.getElementById('realiz1')!.classList.add('active');
    this.HistoryWeek('realiz1');
  }

  ngOnInit(): void {
    this.idDev = this.router1.snapshot.params['idDev'];
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

  HistoryWeek(id: string) {
    this.loadData(
      this.timeService.historyDeviceWeek.bind(this.timeService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          this.activateButton(id);
          return { name: dayName, series: item.series };
        });
      }
    );
  }

  HistoryMonth(id: string) {
    this.loadData(
      this.timeService.historyDeviceMonth.bind(this.timeService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const weekNumber = this.getWeek(date);
          this.activateButton(id);
          return { name: `Week ${weekNumber}`, series: item.series };
        });
      }
    );
  }

  HistoryYear(id: string) {
    this.loadData(
      this.timeService.historyDeviceYear.bind(this.timeService, this.idDev),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const monthName = date.toLocaleDateString('en-US', { month: 'long' });
          this.activateButton(id);
          return { name: monthName, series: item.series };
        });
      }
    );
  }

  loadData(apiCall: any, mapFunction: any) {
    apiCall().subscribe((response: any) => {
      const myList = Object.keys(response.timestamps).map((name) => {
        let consumptionValue = response.timestamps[name];
        let predictionValue = response.predictions[name];
        const cons: string = this.type.toLowerCase();
        const pred: string = 'prediction';
        if(this.type == 'Production')
        {
          this.colors = {
            name: 'mycolors',
            selectable: true,
            group: ScaleType.Ordinal,
            domain: ['#80BC00', '#F4C430'],
          };
        }
        if(this.type == 'Storage')
        {
          this.colors = {
            name: 'mycolors',
            selectable: true,
            group: ScaleType.Ordinal,
            domain: ['blue', '#F4C430'],
          };
        }
        if (predictionValue == undefined) {
          predictionValue = 0.0;
        }
        if (consumptionValue == undefined) {
          consumptionValue = 0.0;
        }
        const series = [
          { name: cons, value: consumptionValue },
          { name: pred, value: predictionValue },
        ];
        return { name, series };
      });
      this.data = mapFunction(myList);
      console.log(this.data);
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
