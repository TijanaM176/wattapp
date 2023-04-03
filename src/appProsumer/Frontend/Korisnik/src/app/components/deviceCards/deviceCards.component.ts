import { Component, OnInit } from '@angular/core';
import { ProsumerService } from 'src/app/services/prosumer.service';

@Component({
  selector: 'app-deviceCards',
  templateUrl: './deviceCards.component.html',
  styleUrls: ['./deviceCards.component.css'],
})
export class DeviceCardsComponent implements OnInit {
  consumers: any[] = [];
  producers: any[] = [];
  storages: any[] = [];
  devices: any[] = [];

  constructor(private service: ProsumerService) {}

  ngOnInit() {
    this.service
      .getDevicesByProsumerId('2562a789-6d38-44bf-baf8-7b3a4f6c8ca5')
      .subscribe((response) => {
        this.devices = [
          ...response.consumers,
          ...response.producers,
          ...response.storage,
        ];
        this.consumers = response.consumers;
        this.producers = response.producers;
        this.storages = response.storage;
        console.log(this.devices);
      });
  }
}
