import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-consumptionFilter',
  templateUrl: './consumptionFilter.component.html',
  styleUrls: ['./consumptionFilter.component.css'],
})
export class ConsumptionFilterComponent implements OnInit {
  minValue: number = 10;
  maxValue: number = 90;
  options: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + 'kwh';
        case LabelType.High:
          return value + 'kwh';
        default:
          return '' + value;
      }
    },
  };
  constructor() {}

  ngOnInit() {}
}
