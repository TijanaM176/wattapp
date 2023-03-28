import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  SimpleChanges,
} from '@angular/core';
import { Devices } from 'src/app/models/prosumerDevices';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { CookieService } from 'ngx-cookie-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabelaUredjaja',
  templateUrl: './tabelaUredjaja.component.html',
  styleUrls: ['./tabelaUredjaja.component.css'],
})
export class TabelaUredjajaComponent implements OnInit {
  showConsumers = true;
  showTable = true;
  showProducers = false;
  showStorages = false;
  currentPage = 1;
  itemsPerPage = 10;
  searchName: string = '';
  value: string = '0';
  devices: any[] = [];
  devicesToShow: any[] = [];
  filteredDevices: any[] = [];
  idKorisnika = '41d3bcda-3d4e-40d4-bf42-0ad50eb0b22a';
  dataSource = new MatTableDataSource<any[]>(this.devices);
  constructor(
    private userService: UsersServiceService,
    private cookie: CookieService
  ) {}

  ngOnInit() {
    this.showConsumers = true;
    this.userService
      .getDevicesByProsumerId(this.idKorisnika)
      .subscribe((response) => {
        this.devicesToShow = [
          ...response.consumers,
          ...response.producers,
          ...response.storage,
        ];
        this.devices = [
          ...response.consumers,
          ...response.producers,
          ...response.storage,
        ];
      });
  }
  get pages() {
    const totalPages = Math.ceil(this.devicesToShow.length / this.itemsPerPage);
    return Array(totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  filterDevices() {
    let selectedCategories: any[] = [];
    if (this.showConsumers) selectedCategories.push(1);
    if (this.showProducers) selectedCategories.push(2);
    if (this.showStorages) selectedCategories.push(3);

    if (selectedCategories.length === 0) {
      this.devicesToShow = [];
    } else {
      this.devicesToShow = this.devices.filter((device) =>
        selectedCategories.includes(device.categoryId)
      );
    }

    this.filterByName();
    this.pages;
    return this.devicesToShow;
  }

  filterByName() {
    this.devicesToShow = this.devicesToShow.filter((device) =>
      device.name.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }
}
