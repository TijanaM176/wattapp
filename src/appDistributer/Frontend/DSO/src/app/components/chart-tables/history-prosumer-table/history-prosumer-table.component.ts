import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-history-prosumer-table',
  templateUrl: './history-prosumer-table.component.html',
  styleUrls: ['./history-prosumer-table.component.css']
})
export class HistoryProsumerTableComponent {
  @Input() data : any[] = [];
  @Input() type : string = '';
}
