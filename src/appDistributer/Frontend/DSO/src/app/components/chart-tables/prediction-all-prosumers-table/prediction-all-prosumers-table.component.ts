import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prediction-all-prosumers-table',
  templateUrl: './prediction-all-prosumers-table.component.html',
  styleUrls: ['./prediction-all-prosumers-table.component.css']
})
export class PredictionAllProsumersTableComponent {
  @Input() data : any[] = [];
}
