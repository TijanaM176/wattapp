import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-productionFilter',
  templateUrl: './productionFilter.component.html',
  styleUrls: ['./productionFilter.component.css'],
})
export class ProductionFilterComponent implements OnInit {
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  constructor() {}

  ngOnInit() {}
}
