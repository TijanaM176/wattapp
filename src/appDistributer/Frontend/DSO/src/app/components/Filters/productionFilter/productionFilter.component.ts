import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-productionFilter',
  templateUrl: './productionFilter.component.html',
  styleUrls: ['./productionFilter.component.css'],
})
export class ProductionFilterComponent implements OnInit {
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

  ngOnInit() {}
}
