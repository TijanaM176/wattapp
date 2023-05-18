import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from 'src/app/services/data.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { editUserDto } from 'src/app/models/editUserDto';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { TabelaUredjajaComponent } from '../tabelaUredjaja/tabelaUredjaja.component';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-user1',
  templateUrl: './user1.component.html',
  styleUrls: ['./user1.component.css'],
})
export class User1Component implements OnInit, AfterViewInit {
  @ViewChild('deviceTabela', { static: true })
  devicesStatus!: TabelaUredjajaComponent;
  currentConsumption: number = 0;
  currentProduction: number = 0;
  deviceCount: number = 0;
  realDeviceCount: number = 0;
  loader: boolean = true;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  constructor(
    private user1: EmployeesServiceService,
    private user: UsersServiceService,
    private router: ActivatedRoute,
    private employyeService: EmployeesServiceService,
    private spiner: NgxSpinnerService,
    private cookie: CookieService,
    private serviceData: DataService,
    private widthService: ScreenWidthService,
    private r: Router,
    private deviceService: DeviceserviceService,
    private _sanitizer: DomSanitizer
  ) {}
  letValue: string = '';
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  address: string = '';
  Region: string = '';
  city: string = '';
  type: string = '';
  image!: string;
  imageSource!: any;
  editUser = new FormGroup({
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    Username: new FormControl(''),
    Email: new FormControl(''),
    Address: new FormControl(''),
    NeigborhoodName: new FormControl(''),
    Latitude: new FormControl(''),
    Longitude: new FormControl(''),
    CityName: new FormControl(''),
  });
  message: boolean = false;
  userOldInfo: any;
  thresholds: object = {};
  canDeleteEdit: boolean = false;

  onCurrentValuesReceived(values: [number, number, number, number]) {
    const [consumption, production, deviceCount, realDeviceCount] = values;
    // Do something with the received values
    console.log(
      `Consumption: ${consumption}, Production: ${production}, Device count: ${deviceCount}`
    );
    this.deviceCount = deviceCount;
    this.currentConsumption = consumption;
    this.currentProduction = production;
    this.realDeviceCount = realDeviceCount;
  }

  ngOnInit(): void {
    document.getElementById('userInfoDataContainer')!.style.height =
      this.widthService.height + 'px';
    this.letValue = this.cookie.get('role');
    if (this.letValue === 'Admin') this.canDeleteEdit = true;
    this.spiner.show();
    this.disableDelete(this.letValue);
    this.getInformations();
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      document.getElementById('userInfoDataContainer')!.style.height =
        this.widthService.height + 'px';
    });
  }

  getInformations() {
    this.user
      .detailsEmployee(this.router.snapshot.params['id'])
      .subscribe((data: any) => {
        // console.log(data);
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.username = data.userName;
        this.email = data.email;
        this.address = data.address;
        this.Image(data.image);
        this.id = this.router.snapshot.params['id'];
        this.Region = this.cookie.get('region');
        this.serviceData.getCityNameById(data.cityId).subscribe((dat) => {
          // console.log(dat)
          this.city = dat;
          this.userOldInfo = data;
          this.editUser = new FormGroup({
            FirstName: new FormControl(data['firstName']),
            LastName: new FormControl(data['lastName']),
            Username: new FormControl(data['username']),
            Email: new FormControl(data['email']),
            Address: new FormControl(data['address']),
            NeigborhoodName: new FormControl(data['regionId']),
            Latitude: new FormControl(''),
            Longitude: new FormControl(''),
            CityName: new FormControl(''),
          });
        });
        this.thresholds = {
          '0': { color: '#5875A1', bgOpacity: 0.2, fontSize: '16px' },
        };
      });
  }

  ngAfterViewInit(): void {
    document.getElementById('userInfoDataContainer')!.style.height =
      this.widthService.height + 'px';
  }
  UpdateData() {
    let dto: editUserDto = new editUserDto();
    dto.id = this.router.snapshot.params['id'];
    dto.firstName = this.editUser.value.FirstName!;
    dto.lastName = this.editUser.value.LastName!;
    if (this.userOldInfo.email != this.editUser.value.Email) {
      dto.email = this.editUser.value.Email!;
    }
    this.user.updateUserData(dto.id, dto).subscribe((res) => {
      this.getInformations();
    });
    const buttonRef = document.getElementById('closeBtn1');
    buttonRef?.click();
  }

  DeleteUser() {
    if (confirm('Do you want to delete ?')) {
      this.user.deleteUser(this.router.snapshot.params['id']).subscribe({
        next: (res) => {
          // console.log(res);
          this.r.navigate(['/DsoApp/users']);
        },
        error: (err) => {
          console.log(err.error);
        },
      });
    }
  }

  disableDelete(role: string) {
    let deleteBtn = document.getElementById('delete');
    if (role == 'Dso') {
      deleteBtn?.removeAttribute('disabled');
    } else {
      deleteBtn?.setAttribute('disabled', 'disabled');
    }
  }

  Image(dataImage: any) {
    if (dataImage == '' || dataImage == null) {
      this.imageSource = 'assets/images/defaultProsumer.png';
    } else {
      this.imageSource = this._sanitizer.bypassSecurityTrustResourceUrl(
        `data:image/png;base64, ${dataImage}`
      );
    }
  }
}
