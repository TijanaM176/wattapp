import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prediction-device-table',
  templateUrl: './prediction-device-table.component.html',
  styleUrls: ['./prediction-device-table.component.css']
})
export class PredictionDeviceTableComponent {
  @Input() data : any[] = [];
  @Input() type : string = '';
}
