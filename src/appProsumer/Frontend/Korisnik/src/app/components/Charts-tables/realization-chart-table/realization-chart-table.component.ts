import { Component, Input, OnInit } from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';

@Component({
  selector: 'app-realization-chart-table',
  templateUrl: './realization-chart-table.component.html',
  styleUrls: ['./realization-chart-table.component.css']
})
export class RealizationChartTableComponent {
  @Input() data : any[] = [];
  @Input() type : string = '';

  constructor(private widthService : DeviceWidthService) {}
}
