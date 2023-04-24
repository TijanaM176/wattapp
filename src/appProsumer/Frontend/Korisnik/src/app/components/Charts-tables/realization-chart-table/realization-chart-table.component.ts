import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-realization-chart-table',
  templateUrl: './realization-chart-table.component.html',
  styleUrls: ['./realization-chart-table.component.css']
})
export class RealizationChartTableComponent {
  @Input() data : any[] = [];
}
