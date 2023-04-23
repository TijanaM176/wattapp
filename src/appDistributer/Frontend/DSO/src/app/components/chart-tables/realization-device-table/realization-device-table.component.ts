import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-realization-device-table',
  templateUrl: './realization-device-table.component.html',
  styleUrls: ['./realization-device-table.component.css']
})
export class RealizationDeviceTableComponent {
  @Input() data : any[] = [];
  @Input() type : string = '';
}
