import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { DevicesService } from 'src/app/services/devices.service';

@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.css']
})
export class PredictionChartComponent implements OnInit {

  data : any[] = [];
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

  constructor(private deviceService : DevicesService, private widthService : DeviceWidthService) {}

  ngOnInit(): void {
    const grafik = document.getElementById('predikcija');
    grafik!.style.height = (this.widthService.height * 0.6) + 'px';
    this.PredictionWeek("prediction3");
    //document.getElementById("prediction3")!.classList.add('active');
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

  PredictionWeek(id : string)
  {
    this.loadData(
      this.deviceService.prediction1Week.bind(this.deviceService),
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

  Prediction3Days(id : string)
  {
    this.loadData(
      this.deviceService.prediction3Days.bind(this.deviceService),
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

  Prediction1Day(id : string)
  {
    this.loadData(
      this.deviceService.prediction1Day.bind(this.deviceService),
      (myList: any[]) => {
        return myList.map((item) => {
          const date = new Date(item.name);
          const hour = date.getHours();
          this.activateButton(id);
          return { name: hour+':00h', series: item.series };
        });
      }
    );
  }

  loadData(apiCall: any, mapFunction: any) 
  {
    apiCall().subscribe((response: any) => {
      //console.log(response);
      const myList = Object.keys(response.consumption).map(
        (name) => {
          let consumptionValue = response.consumption[name];
          let productionValue = response.production[name];
          const cons: string = 'consumption';
          const prod: string = 'producton';
          if (productionValue == undefined) {
            productionValue = 0.0;
          }
          if (consumptionValue == undefined) {
            consumptionValue = 0.0;
          }
          const series = [
            { name: cons, value: consumptionValue },
            { name: prod, value: productionValue },
          ];
          return { name, series };
        }
      );
      this.data = mapFunction(myList);
    });
  }

  activateButton(buttonNumber: string) {
    const buttons = document.querySelectorAll('.predictionbtn');
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
