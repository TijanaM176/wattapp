import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Color, ColorHelper, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-realization-chart',
  templateUrl: './realization-chart.component.html',
  styleUrls: ['./realization-chart.component.css']
})
export class RealizationChartComponent implements OnInit, AfterViewInit {

  data : any[] = [];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#c14b48', 'rgb(219, 169, 30)'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition : LegendPosition = LegendPosition.Below;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Energy in kWh';

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  coef : number = 0.6;
  
  constructor(private deviceService : DevicesService, private widthService : DeviceWidthService) {}

  ngAfterViewInit(): void {
    const grafik = document.getElementById('grafikConsumptionHistory');
    grafik!.style!.height = (this.widthService.height * this.coef)+'px';
    document.getElementById('realiz1')!.classList.add("active");
  }

  ngOnInit(): void {
    // this.HistoryWeekInit();

    if(this.widthService.deviceWidth>=576 || this.widthService.height>=this.widthService.deviceWidth*2) this.coef = 0.5;

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.coef = 0.6;
      if(this.widthService.deviceWidth>=576 || this.widthService.height>=this.widthService.deviceWidth*2) this.coef = 0.5;
      const grafik = document.getElementById('grafikConsumptionHistory');
      grafik!.style!.height = (this.widthService.height * this.coef) + 'px';
    });
  }

  yAxisTickFormatting(value: number) 
  {
    return value + ' kW';
  }

  getWeek(date: Date): number 
  {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(
      ((date.getTime() - oneJan.getTime()) / millisecsInDay +
        oneJan.getDay() +
        1) /
        7
    );
  }

  HistoryWeekInit(data : any) 
  {
    const myList = Object.keys(data.consumption.timestamps).map(
      (name) => {
        let consumptionValue = data.consumption.timestamps[name];
        let predictionValue = data.consumption.predictions[name];
        const cons: string = 'consumption';
        const pred: string = 'prediction';
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
      }
    );
    this.data = myList.map((item) => {
      const date = new Date(item.name);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      return { name: dayName, series: item.series };
    });
  }

  HistoryWeek(id : string) 
  {
    this.activateButton(id);
    this.loadData(
      this.deviceService.history7Days.bind(this.deviceService),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          return { name: dayName, series: item.series };
        });
      }
    );
  }

  HistoryMonth(id : string) 
  {
    this.activateButton(id);
    this.loadData(
      this.deviceService.history1Month.bind(this.deviceService),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const weekNumber = this.getWeek(date);
          return { name: `Week ${weekNumber}`, series: item.series };
        });
      }
    );
  }

  HistoryYear(id : string) 
  {
    this.activateButton(id);
    this.loadData(
      this.deviceService.history1Year.bind(this.deviceService),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const monthName = date.toLocaleDateString('en-US', { month: 'long' });
          return { name: monthName, series: item.series };
        });
      }
    );
  }

  loadData(apiCall: any, mapFunction: any) 
  {
    apiCall().subscribe((response: any) => {
      // console.log(response.consumption);
      const myList = Object.keys(response.consumption.timestamps).map(
        (name) => {
          let consumptionValue = response.consumption.timestamps[name];
          let predictionValue = response.consumption.predictions[name];
          const cons: string = 'consumption';
          const pred: string = 'prediction';
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
        }
      );
      this.data = mapFunction(myList);
      // console.log(this.data);
    });
  }

  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.realizationbtn');
    buttons.forEach(button=>{
      if(button.id == buttonNumber)
      {
        button.classList.add('active');
      }
      else
      {
        button.classList.remove('active');
      }
    })
  }
}
