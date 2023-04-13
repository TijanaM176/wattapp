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
  devicesToShow: any[] = [];
  devices: any[] = [];
  role: string = '';
  loader:boolean=true;
  constructor(
    private service: ProsumerService,
    private cookie: CookieService
  ) {}

  ngOnInit() {
    this.id = this.cookie.get('id');
    this.role = this.cookie.get('role');
    this.service
      .getDevicesByProsumerId(this.id, this.role)
      .subscribe((response) => {
        this.devices = [
          ...response.consumers,
          ...response.producers,
          ...response.storage,
        ];
        this.devicesToShow = this.devices;
        console.log(this.devices);
        this.devices.forEach((device) => {
          this.Usage(device.Id);
        });
      });
      setTimeout(()=>{
        this.loader=false;
      },6000);
  }

  Usage(id: string) {
    this.service.getDeviceById(id).subscribe((response) => {
      this.deviceUsages[id] = response.CurrentUsage;
    });
  }

  filterDevices() {
    let selectedCategories: any[] = [];
    if (this.consumers) selectedCategories.push(1);
    if (this.producers) selectedCategories.push(2);
    if (this.storages) selectedCategories.push(3);

    if (selectedCategories.length === 0) {
      this.devicesToShow = [];
    } else {
      this.devicesToShow = this.devices.filter((device) =>
        selectedCategories.includes(device.CategoryId)
      );
    }
    return this.devicesToShow;
  }
}
