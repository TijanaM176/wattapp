import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-history-all-prosumers-table',
  templateUrl: './history-all-prosumers-table.component.html',
  styleUrls: ['./history-all-prosumers-table.component.css'],
})
export class HistoryAllProsumersTableComponent {
  @Input() data: any = [];
}
