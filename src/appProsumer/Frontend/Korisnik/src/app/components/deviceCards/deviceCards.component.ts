import { Component, OnInit } from '@angular/core';
import { ProsumerService } from 'src/app/services/prosumer.service';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-deviceCards',
  templateUrl: './deviceCards.component.html',
  styleUrls: ['./deviceCards.component.css'],
})
export class DeviceCardsComponent implements OnInit {
  id: string = '';
  color: ThemePalette = 'primary';
  checked = true;
  disabled = false;
  notChecked = false;
  deviceUsages: { [key: string]: number } = {};
  consumers: any[] = [];
  producers: any[] = [];
  storages: any[] = [];
  devices: any[] = [];
  role:string='';
  constructor(
    private service: ProsumerService,
    private cookie: CookieService
  ) {}

  ngOnInit() {
    this.id = this.cookie.get('id');
    this.role=this.cookie.get('role');
    this.service.getDevicesByProsumerId(this.id,this.role).subscribe((response) => {
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
