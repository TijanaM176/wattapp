import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prediction-prosumer-table',
  templateUrl: './prediction-prosumer-table.component.html',
  styleUrls: ['./prediction-prosumer-table.component.css']
})
export class PredictionProsumerTableComponent {
  @Input() data : any[] = [];
}
