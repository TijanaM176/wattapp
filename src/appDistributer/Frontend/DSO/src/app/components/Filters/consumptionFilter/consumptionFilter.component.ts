import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-consumptionFilter',
  templateUrl: './consumptionFilter.component.html',
  styleUrls: ['./consumptionFilter.component.css'],
})
export class ConsumptionFilterComponent implements OnInit {
  value: number = 0;
  highValue: number = 200;
  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + 'kwh';
        case LabelType.High:
          return value + 'kwh';
        default:
          return value + 'kwh';
      }
    },
  };

  constructor() {}

  ngOnInit() {}
}
