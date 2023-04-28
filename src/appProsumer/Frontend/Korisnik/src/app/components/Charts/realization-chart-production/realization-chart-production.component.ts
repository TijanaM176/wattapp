import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Color, ColorHelper, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';

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
  
  constructor(private deviceService : DevicesService, private widthService : DeviceWidthService) {}

  ngAfterViewInit(): void {
    const grafik = document.getElementById('grafikPredictionHistory');
    grafik!.style.height = (this.widthService.height*0.6)+'px';
    document.getElementById('realizPred1')!.classList.add("active");
  }

  ngOnInit(): void {
    this.HistoryWeekInit();
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

  HistoryWeek(id : string) 
  {
    this.loadData(
      this.deviceService.history7Days.bind(this.deviceService),
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
      this.deviceService.history1Month.bind(this.deviceService),
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
      this.deviceService.history1Year.bind(this.deviceService),
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
    apiCall().subscribe((response: any) => {
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
