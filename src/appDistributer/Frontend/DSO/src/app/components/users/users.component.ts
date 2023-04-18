import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Router } from '@angular/router';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  searchName: string = '';
  searchAddress: string = '';
  prosumer!: any;
  total!: number;
  loader: boolean = true;
  perPage: number = 10;
  prosumers!: any;
  pagenum!: number;
  page: number = 1;
  tableSizes: any = [10, 15, 20];
  orderHeader: String = '';
  isDescOrder: boolean = true;
  constructor(public service: UsersServiceService, private router: Router,public serviceDevice:DeviceserviceService) {}
  ngOnInit(): void {
    this.serviceDevice.ProsumersInfo();
  }
  Details(id: string) {
    this.service.detailsEmployee(id).subscribe((res) => {
      this.prosumer = res;

      console.log(this.prosumer);
      this.router.navigate(['/user'], {
        queryParams: { id: this.prosumer.id },
      });
      console.log(id);
    });
  }

  Paging() {
    this.service.Page(this.page, this.perPage).subscribe((res) => {
      this.prosumers = res;
      console.log(this.serviceDevice.prosumers);
    });
  }
  onTableDataChange(event: any) {
    this.page = event;
    console.log(this.page);
    this.Paging();
  }
  sort(headerName: String) {
    this.isDescOrder = !this.isDescOrder;
    this.orderHeader = headerName;
  }
}
