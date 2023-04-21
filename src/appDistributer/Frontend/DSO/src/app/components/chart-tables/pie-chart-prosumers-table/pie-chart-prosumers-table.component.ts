import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pie-chart-prosumers-table',
  templateUrl: './pie-chart-prosumers-table.component.html',
  styleUrls: ['./pie-chart-prosumers-table.component.css']
})
export class PieChartProsumersTableComponent {
  @Input() currentData : any = [];
  @Input() currentTitle : string = "";
}
