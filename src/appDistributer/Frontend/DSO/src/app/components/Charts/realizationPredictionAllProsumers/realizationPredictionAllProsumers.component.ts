import { Component, OnInit } from '@angular/core';
import { ScaleType, Color, LegendPosition } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimestampService } from 'src/app/services/timestamp.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import * as XLSX from 'xlsx';

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
    private spinner: NgxSpinnerService,
    private servicetime: TimestampService,
    private widthService: ScreenWidthService
  ) {}

  yAxisTickFormatting(value: number) {
    return value;
  }

  ngOnInit() {
    this.HistoryWeekInit();
    document.getElementById(
      'modalFadeRealizationPredictionAllProsumers'
    )!.style.maxHeight = this.widthService.height * 0.7 + 'px';
  }

  HistoryMonth() {
    this.show = true;
    this.spinner.show('spiner1');
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
          seriesData[index].series.push({
            name: `${monthName}  ${dayNumber}`,
            value: seriesItem.value,
          });
        });
      });
      seriesData.forEach((seriesItem: any) => {
        seriesItem.series.pop();
      });
      this.data = seriesData;
      this.spinner.hide('spiner1');
      this.show = false;
    });
  }

  HistoryYear() {
    this.show = true;
    this.spinner.show('spiner1');
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
      this.spinner.hide('spiner1');
      this.show = false;
    });
  }

  HistoryWeek() {
    this.show = true;
    this.spinner.show('spiner1');
    this.servicetime.HistoryAllProsumers7Days().subscribe((response: any) => {
      console.log(response);
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

      // Remove the last item from each series array
      seriesData.forEach((seriesItem) => {
        seriesItem.series.pop();
      });

      this.data = seriesData;
      this.spinner.hide('spiner1');
      this.show = false;
    });
  }

  HistoryWeekInit() {
    
    this.spinner.show('mainSpiner');
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
      seriesData.forEach((seriesItem) => {
        seriesItem.series.pop();
      });

      this.data = seriesData;
      this.spinner.hide('mainSpiner');
      console.log(this.data);
    });
  }

  exportTable(): void {
    let headerRow: any[] = [];

    headerRow = [
      '',

      'Consumption',
      'Prediction for Consumption (kW)',
      'Production',
      'Prediction for Production (kW)',
    ];

    const sheetData = [headerRow];

    for (let i = 0; i < this.data[0]?.series.length; i++) {
      const rowData = [this.data[0]?.series[i]?.name];

      for (let j = 0; j < this.data.length; j++) {
        const value = this.data[j]?.series[i]?.value?.toFixed(2);
        rowData.push(value);
      }

      sheetData.push(rowData);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, 'chart-data.xlsx');
  }
}
