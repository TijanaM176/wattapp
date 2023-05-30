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
  letValue: string = '';
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

  constructor(
    public service: UsersServiceService,
    private router: Router,
    public serviceDevice: DeviceserviceService
  ) {}
  
  ngOnInit(): void {
    this.serviceDevice.ProsumersInfo();
  }
  Details(id: string) {
    this.service.detailsEmployee(id).subscribe((res) => {
      // console.log(res);
      this.prosumer = res;

      console.log(this.prosumer);
      this.router.navigate(['/user'], {
        queryParams: { id: this.prosumer.id },
      });
      // console.log(id);
    });
  }

  Paging() {
    this.service.Page(this.page, this.perPage).subscribe((res: any) => {
      this.prosumers = res;
      // console.log(this.serviceDevice.prosumers);
    });
  }
  onTableDataChange(event: any) {
    this.page = event;
    // console.log(this.page);
    this.Paging();
  }
  sort(headerName: String) {
    this.isDescOrder = !this.isDescOrder;
    this.orderHeader = headerName;
  }

  Image(base64string: string) {
    let currentImage = 'assets/images/defaultProsumer.png';
    if (base64string != '' && base64string != null) {
      let byteArray = new Uint8Array(
        atob(base64string)
          .split('')
          .map((char) => char.charCodeAt(0))
      );
      let file = new Blob([byteArray], { type: 'image/png' });
      currentImage = URL.createObjectURL(file);
    }
    return currentImage;
  }
}
