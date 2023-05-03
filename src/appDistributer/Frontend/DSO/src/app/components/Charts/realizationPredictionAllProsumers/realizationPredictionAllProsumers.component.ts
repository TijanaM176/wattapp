import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { strings } from '@material/slider';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { ScaleType, Color, LegendPosition } from '@swimlane/ngx-charts';
import { BrowserModule } from '@angular/platform-browser';
import { line } from 'd3-shape';
import { scaleBand, scaleLinear } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboarddataService } from 'src/app/services/dashboarddata.service';
import { TimestampService } from 'src/app/services/timestamp.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';

@Component({
  selector: 'app-realizationPredictionAllProsumers',
  templateUrl: './realizationPredictionAllProsumers.component.html',
  styleUrls: ['./realizationPredictionAllProsumers.component.css'],
})
export class RealizationPredictionAllProsumersComponent implements OnInit {
  production = true;
  consumption = true;
  legendPosition: LegendPosition = 'below' as LegendPosition;
  id: string = '';
  data: any = [];
  dataConsumers: any = [];
  dataProducers: any = [];
  colors: Color = {
    name: 'mycolors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF0000', '#93FF00 ', '#0028A4', '#068700'],
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  yAxisLabel = 'Energy  ( kWh )';
  show!: boolean;
  constructor(
    private service: UsersServiceService,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private servicetime: TimestampService,
    private widthService: ScreenWidthService
  ) {}

  yAxisTickFormatting(value: number) {
    return value;
  }

  ngOnInit() {
    this.HistoryWeekInit();
    this.spinner.show();
    this.HistoryWeek();
    document.getElementById(
      'modalFadeRealizationPredictionAllProsumers'
    )!.style.maxHeight = this.widthService.height * 0.7 + 'px';
  }

  HistoryMonth() {
    this.show = true;
    this.spinner.show();
    this.servicetime.HistoryAllProsumers1Month().subscribe((response: any) => {
      const seriesData: any = [
        { name: 'Consumption', series: [] },
        { name: 'Production', series: [] },
        { name: 'Prediction for Consumption', series: [] },
        { name: 'Prediction for Production', series: [] },
      ];

      const consumptionTimestamps = response.consumption.timestamps || {};
      const consumptionPredictions = response.consumption.predictions || {};
      const productionTimestamps = response.production.timestamps || {};
      const productionPredictions = response.production.predictions || {};

      const allTimestamps = {
        ...consumptionTimestamps,
        ...productionTimestamps,
      };

      Object.keys(allTimestamps).forEach((name) => {
        const consumptionValue = consumptionTimestamps[name] || 0.0;
        const consumptionPredictionValue = consumptionPredictions[name] || 0.0;
        const productionValue = productionTimestamps[name] || 0.0;
        const productionPredictionValue = productionPredictions[name] || 0.0;

        // Create a new Date object from the name string
        const date = new Date(name);

        const series = [
          { name: 'Consumption', value: consumptionValue },
          { name: 'Production', value: productionValue },
          {
            name: 'Prediction for Consumption',
            value: consumptionPredictionValue,
          },
          {
            name: 'Prediction for Production',
            value: productionPredictionValue,
          },
        ];

        series.forEach((seriesItem: any, index: any) => {
          const dayNumber = date.getDate();
          const monthName = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          seriesData[index].series.push({
            name: `${dayNumber}. ${monthName} ${year}`,
            value: seriesItem.value,
          });
        });
      });
      this.data = seriesData;
      this.spinner.hide();
      this.show = false;
    });
  }

  HistoryYear() {
    this.show = true;
    this.spinner.show();
    this.servicetime.HistoryAllProsumers1Year().subscribe((response: any) => {
      const seriesData: any = [
        { name: 'Consumption', series: [] },
        { name: 'Production', series: [] },
        { name: 'Prediction for Consumption', series: [] },
        { name: 'Prediction for Production', series: [] },
      ];

      const consumptionTimestamps = response.consumption.timestamps || {};
      const consumptionPredictions = response.consumption.predictions || {};
      const productionTimestamps = response.production.timestamps || {};
      const productionPredictions = response.production.predictions || {};

      const allTimestamps = {
        ...consumptionTimestamps,
        ...productionTimestamps,
      };

      Object.keys(allTimestamps).forEach((name) => {
        const consumptionValue = consumptionTimestamps[name] || 0.0;
        const consumptionPredictionValue = consumptionPredictions[name] || 0.0;
        const productionValue = productionTimestamps[name] || 0.0;
        const productionPredictionValue = productionPredictions[name] || 0.0;

        // Create a new Date object from the name string
        const date = new Date(name);

        const series = [
          { name: 'Consumption', value: consumptionValue },
          { name: 'Production', value: productionValue },
          {
            name: 'Prediction for Consumption',
            value: consumptionPredictionValue,
          },
          {
            name: 'Prediction for Production',
            value: productionPredictionValue,
          },
        ];

        series.forEach((seriesItem: any, index: any) => {
          const dayNumber = date.getDate();
          const monthName = date.toLocaleString('default', { month: 'long' });
          seriesData[index].series.push({
            name: `${monthName}`,
            value: seriesItem.value,
          });
        });
      });

      this.data = seriesData;
      this.spinner.hide();
      this.show = false;
    });
  }

  HistoryWeek() {
    this.show = true;
    this.spinner.show();
    this.servicetime.HistoryAllProsumers7Days().subscribe((response: any) => {
      const seriesData: any[] = [
        { name: 'Consumption', series: [] },
        { name: 'Production', series: [] },
        { name: 'Prediction for Consumption', series: [] },
        { name: 'Prediction for Production', series: [] },
      ];

      const allTimestamps = {
        ...response.consumption.timestamps,
        ...response.production.timestamps,
      };

      Object.entries(allTimestamps).forEach(([name, value]) => {
        const consumptionValue = response.consumption.timestamps[name] || 0.0;
        const consumptionPredictionValue =
          response.consumption.predictions[name] || 0.0;
        const productionValue = response.production.timestamps[name] || 0.0;
        const productionPredictionValue =
          response.production.predictions[name] || 0.0;

        const date = new Date(name);
        const dayNumber = date.getDate();
        const monthName = date.toLocaleString('default', { month: 'long' });

        seriesData.forEach((seriesItem, index) => {
          seriesItem.series.push({
            name: `${monthName} ${dayNumber}`,
            value: [
              consumptionValue,
              productionValue,
              consumptionPredictionValue,
              productionPredictionValue,
            ][index],
          });
        });
      });

      this.data = seriesData;
      this.spinner.hide();
      this.show = false;
    });
  }
  HistoryWeekInit() {
    this.show = false;

    this.servicetime.HistoryAllProsumers7Days().subscribe((response: any) => {
      const seriesData: any[] = [
        { name: 'Consumption', series: [] },
        { name: 'Production', series: [] },
        { name: 'Prediction for Consumption', series: [] },
        { name: 'Prediction for Production', series: [] },
      ];

      const allTimestamps = {
        ...response.consumption.timestamps,
        ...response.production.timestamps,
      };

      Object.entries(allTimestamps).forEach(([name, value]) => {
        const consumptionValue = response.consumption.timestamps[name] || 0.0;
        const consumptionPredictionValue =
          response.consumption.predictions[name] || 0.0;
        const productionValue = response.production.timestamps[name] || 0.0;
        const productionPredictionValue =
          response.production.predictions[name] || 0.0;

        const date = new Date(name);
        const dayNumber = date.getDate();
        const monthName = date.toLocaleString('default', { month: 'long' });

        seriesData.forEach((seriesItem, index) => {
          seriesItem.series.push({
            name: `${monthName} ${dayNumber}`,
            value: [
              consumptionValue,
              productionValue,
              consumptionPredictionValue,
              productionPredictionValue,
            ][index],
          });
        });
      });

      this.data = seriesData;
    });
  }
}
