import { Component, OnInit } from '@angular/core';
import { DashboarddataService } from 'src/app/services/dashboarddata.service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-top5Producers',
  templateUrl: './top5Producers.component.html',
  styleUrls: ['./top5Producers.component.css'],
})
export class Top5ProducersComponent implements OnInit {
  isConsumersChecked = true;
  isProducersChecked = false;

  producers: any[] = [];
  consumers: any[] = [];
  currentHour: number = 0;

  constructor(
    private service: UsersServiceService,
    private servicedash: DashboarddataService
  ) {}

  ngOnInit() {
    this.servicedash.Top5Consumers().subscribe((response) => {
      this.consumers = response;
    });
    this.servicedash.Top5Producers().subscribe((response) => {
      this.producers = response;
    });
    this.currentHour = new Date().getHours();
  }

  onRadioButtonChange(event: any, type: string) {
    if (type === 'consumers') {
      this.isConsumersChecked = event.target.checked;
      if (this.isConsumersChecked) {
        this.isConsumersChecked = true;
        this.isProducersChecked = false;
      } else {
        this.isConsumersChecked = false;
        this.isProducersChecked = true;
      }
    } else if (type === 'producers') {
      this.isProducersChecked = event.target.checked;
      if (this.isProducersChecked) {
        this.isConsumersChecked = false;
        this.isProducersChecked = true;
      } else {
        this.isConsumersChecked = true;
        this.isProducersChecked = false;
      }
    }
  }
}
