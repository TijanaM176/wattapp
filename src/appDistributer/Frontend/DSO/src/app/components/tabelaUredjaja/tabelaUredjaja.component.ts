import { Component, OnInit } from '@angular/core';
import { Devices } from 'src/app/models/prosumerDevices';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-tabelaUredjaja',
  templateUrl: './tabelaUredjaja.component.html',
  styleUrls: ['./tabelaUredjaja.component.css'],
})
export class TabelaUredjajaComponent implements OnInit {
  searchName: string = '';
  value: string = '0';
  devices: any[] = [];
  consumers: any[] = [];
  producers: any[] = [];
  storages: any[] = [];
  idKorisnika = '41d3bcda-3d4e-40d4-bf42-0ad50eb0b22a';
  constructor(
    private userService: UsersServiceService,
    private cookie: CookieService
  ) {}

  ngOnInit() {
    this.userService
      .getDevicesByProsumerId(this.idKorisnika)
      .subscribe((response) => {
        this.producers = response.producers;
        this.storages = response.storages;
        this.consumers = response.consumers;
      });
  }
}
