import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, ColorHelper, LegendPosition, ScaleType } from '@swimlane/ngx-charts';

import { fromEvent, Observable, Subscription } from 'rxjs';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-realization-chart-production',
  templateUrl: './realization-chart-production.component.html',
  styleUrls: ['./realization-chart-production.component.css']
})
export class RealizationChartProductionComponent implements OnInit, AfterViewInit {

  data : any[] = [];
  dataConsumers: any[] = [];
  dataProducers: any[] = [];
  production = true;
  consumption = true;
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#48bec1', 'rgb(200, 219, 30)'],
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
  id!:string;
  
  constructor(private deviceService : DeviceserviceService,
    private widthService : ScreenWidthService,
    private serviceTime:TimestampService,
    private router: ActivatedRoute,
    private service: UsersServiceService) {}

  ngAfterViewInit(): void {
    const grafik = document.getElementById('grafikPredictionHistory');
    grafik!.style.height = (this.widthService.height  *this.coef)+'px';
    document.getElementById('realizPred1')!.classList.add("active");
  }

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.HistoryWeekInit();
    if(this.widthService.deviceWidth>=576 || this.widthService.height>=this.widthService.deviceWidth*2) this.coef = 0.5;

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      this.coef = 0.6;
      if(this.widthService.deviceWidth>=576 || this.widthService.height>=this.widthService.deviceWidth*2) this.coef = 0.5;
      const grafik = document.getElementById('grafikPredictionHistory');
      grafik!.style.height = (this.widthService.height * this.coef) + 'px';
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

  HistoryWeekInit() 
  {
    this.loadData(
      this.serviceTime.HistoryProsumer7Days.bind(this.deviceService)(this.id),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          return { name: dayName, series: item.series };
        });
      }
    );
  }

  HistoryWeek(id : string) 
  {
    this.loadData(
      this.serviceTime.HistoryProsumer7Days.bind(this.service)(this.id),
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

  HistoryMonth(id : string) 
  {
    this.loadData(
      this.serviceTime.HistoryProsumer1Month.bind(this.service)(this.id),
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

  HistoryYear(id : string) 
  {
    this.loadData(
      this.serviceTime.HistoryProsumer1Year.bind(this.service)(this.id),
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

  loadData(apiCall: any, mapFunction: any) 
  {
    apiCall.subscribe((response: any) => {
      // console.log(response.consumption);
      const myList = Object.keys(response.production.timestamps).map(
        (name) => {
          let consumptionValue = response.production.timestamps[name];
          let predictionValue = response.production.predictions[name];
          const prod: string = 'production';
          const pred: string = 'prediction';
          if (predictionValue == undefined) {
            predictionValue = 0.0;
          }
          if (consumptionValue == undefined) {
            consumptionValue = 0.0;
          }
          const series = [
            { name: prod, value: consumptionValue },
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
    const buttons = document.querySelectorAll('.realizationPredictionbtn');
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
