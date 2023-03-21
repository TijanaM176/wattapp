import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-numberOfDevices',
  templateUrl: './numberOfDevices.component.html',
  styleUrls: ['./numberOfDevices.component.css'],
})
export class NumberOfDevicesComponent implements OnInit {
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  constructor() {}

  ngOnInit() {}
}
