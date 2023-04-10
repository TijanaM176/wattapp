import { Component, OnInit } from '@angular/core';
import { UsersServiceService } from 'src/app/services/users-service.service';

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

  constructor(private service: UsersServiceService) {}

  ngOnInit() {
    this.service.Top5Consumers().subscribe((response) => {
      this.consumers = response;
    });
    this.service.Top5Producers().subscribe((response) => {
      this.producers = response;
    });
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
    console.log(this.isProducersChecked, this.isConsumersChecked);
  }
}
