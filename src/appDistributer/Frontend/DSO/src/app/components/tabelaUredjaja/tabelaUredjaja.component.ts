import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Devices } from 'src/app/models/prosumerDevices';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { CookieService } from 'ngx-cookie-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { ProsumerProfileVisitService } from 'src/app/services/prosumer-profile-visit.service';

@Component({
  selector: 'app-tabelaUredjaja',
  templateUrl: './tabelaUredjaja.component.html',
  styleUrls: ['./tabelaUredjaja.component.css'],
})
export class TabelaUredjajaComponent implements OnInit {
  id: string = '';
  @Output() current = new EventEmitter<[number, number, number, number]>();
  showConsumers = true;
  showProducers = true;
  showStorages = true;
  showActivity = false;
  showControl = false;
  currentPage = 1;
  itemsPerPage = 10;
  searchName: string = '';
  devices: any[] = [];
  devicesToShow: any[] = [];
  filteredDevices: any[] = [];
  numofdevices: number = 0;
  orderHeader: String = '';
  isDescOrder: boolean = true;
  dataSource = new MatTableDataSource<any[]>(this.devices);
  currentConsumption: number = 0;
  currentProduction: number = 0;
  deviceCount: number = 0;
  realDeviceCount: number = 0;

  prosumerId : string = ''
  prosumerName : string = '';
  prosumerUsername : string = ''

  constructor(
    private userService: UsersServiceService,
    private cookie: CookieService,
    private router: ActivatedRoute,
    private deviceService: DeviceserviceService,
    private profileVisitService : ProsumerProfileVisitService,
    private r : Router
  ) {}

  ngOnInit(): void {
    this.profileVisitService.deleteData();
    this.id = this.router.snapshot.params['id'];
    this.deviceService.getDevicesByProsumerId(this.id).subscribe((response) => {
      // console.log(response);
      this.currentConsumption = response.currentConsumption;
      this.currentProduction = response.currentProduction;
      this.deviceCount = response.deviceCount;
      this.realDeviceCount = response.realDeviceCount;
      this.current.emit([
        this.currentConsumption,
        this.currentProduction,
        this.deviceCount,
        this.realDeviceCount,
      ]);
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
        selectedCategories.includes(device.CategoryId)
      );
    }

    // Apply additional filtering based on conditions
    this.devicesToShow = this.devicesToShow.filter((device) => {
      const currentUsage = device.CurrentUsage;
      const dsoControl = device.DsoControl;

      if (this.showActivity && currentUsage <= 0) {
        return false;
      }

      if (this.showControl && !dsoControl) {
        return false;
      }

      return true;
    });

    this.filterByName();
    this.pages;
    return this.devicesToShow;
  }

  filterByName() {
    this.devicesToShow = this.devicesToShow.filter((device) =>
      device.Name.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }
  sort(headerName: String) {
    this.isDescOrder = !this.isDescOrder;
    this.orderHeader = headerName;
  }

  setProsumer(id : string, name : string, userName : string)
  {
    this.prosumerId = id;
    this.prosumerName = name;
    this.prosumerUsername = userName;
  }

  viewDevice(device : any)
  {
    this.profileVisitService.setData(this.prosumerUsername, this.prosumerName);
    // console.log(this.profileVisitService.nameProsumer, this.profileVisitService.usernameProsumer);
    this.r.navigate(['/DsoApp/user/'+this.prosumerId+'/Devices/deviceinfo/'+device.Id]);
  }
}
