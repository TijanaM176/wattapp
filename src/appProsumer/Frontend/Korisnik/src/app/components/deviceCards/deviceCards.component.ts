import { Component, OnInit } from '@angular/core';
import { ProsumerService } from 'src/app/services/prosumer.service';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-deviceCards',
  templateUrl: './deviceCards.component.html',
  styleUrls: ['./deviceCards.component.css'],
})
export class DeviceCardsComponent implements OnInit {
  color: ThemePalette = 'primary';
  checked = true;
  disabled = false;
  notChecked = false;
  deviceUsages: { [key: string]: number } = {};
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
        console.log(this.devices);
        this.devices.forEach((device) => {
          this.Usage(device.id);
        });
      });
  }

  Usage(id: string) {
    this.service.getDeviceById(id).subscribe((response) => {
      this.deviceUsages[id] = response.CurrentUsage;
    });
  }
}
