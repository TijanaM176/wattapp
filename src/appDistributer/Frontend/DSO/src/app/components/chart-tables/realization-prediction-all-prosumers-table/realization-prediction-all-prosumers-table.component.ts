import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-realization-prediction-all-prosumers-table',
  templateUrl: './realization-prediction-all-prosumers-table.component.html',
  styleUrls: ['./realization-prediction-all-prosumers-table.component.css'],
})
export class RealizationPredictionAllProsumersTableComponent {
  @Input() data: any[] = [];
}
