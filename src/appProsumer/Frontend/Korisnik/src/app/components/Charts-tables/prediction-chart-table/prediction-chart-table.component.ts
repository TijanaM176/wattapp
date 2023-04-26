import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prediction-chart-table',
  templateUrl: './prediction-chart-table.component.html',
  styleUrls: ['./prediction-chart-table.component.css']
})
export class PredictionChartTableComponent {
  @Input() data : any[] = [];
}
