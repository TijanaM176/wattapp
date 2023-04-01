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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabelaUredjaja',
  templateUrl: './tabelaUredjaja.component.html',
  styleUrls: ['./tabelaUredjaja.component.css'],
})
export class TabelaUredjajaComponent implements OnInit {
  id: string = '';

  showConsumers = true;
  showProducers = true;
  showStorages = true;
  currentPage = 1;
  itemsPerPage = 10;
  searchName: string = '';
  value: string = '0';
  devices: any[] = [];
  devicesToShow: any[] = [];
  filteredDevices: any[] = [];
  dataSource = new MatTableDataSource<any[]>(this.devices);
  constructor(
    private userService: UsersServiceService,
    private cookie: CookieService,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    this.userService.getDevicesByProsumerId(this.id).subscribe((response) => {
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