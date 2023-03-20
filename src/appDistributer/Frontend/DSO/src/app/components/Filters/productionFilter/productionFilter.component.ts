import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-productionFilter',
  templateUrl: './productionFilter.component.html',
  styleUrls: ['./productionFilter.component.css'],
})
export class ProductionFilterComponent implements OnInit {
  value: number = 0;
  highValue: number = 200;
  options: Options = {
    floor: 0,
    ceil: 450,
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
