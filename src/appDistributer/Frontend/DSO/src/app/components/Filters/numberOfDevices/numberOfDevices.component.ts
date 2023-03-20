import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-numberOfDevices',
  templateUrl: './numberOfDevices.component.html',
  styleUrls: ['./numberOfDevices.component.css'],
})
export class NumberOfDevicesComponent implements OnInit {
  value: number = 0;
  highValue: number = 200;
  options: Options = {
    floor: 0,
    ceil: 20,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '';
        case LabelType.High:
          return value + '';
        default:
          return value + '';
      }
    },
  };
  constructor() {}

  ngOnInit() {}
}
