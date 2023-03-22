import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consumptionFilter',
  templateUrl: './consumptionFilter.component.html',
  styleUrls: ['./consumptionFilter.component.css'],
})
export class ConsumptionFilterComponent implements OnInit {
  disabled = false;
  color = '#5875a1';
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  constructor() {}

  ngOnInit() {}
}
