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
import { AuthService } from 'src/app/services/auth.service';
import { SendRefreshToken } from 'src/app/models/sendRefreshToken';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { City } from 'src/app/models/city';
import { Neighborhood } from 'src/app/models/neighborhood';
import { EditProsumerFormComponent } from 'src/app/forms/edit-prosumer-form/edit-prosumer-form.component';
import { ProsumerProfileVisitService } from 'src/app/services/prosumer-profile-visit.service';
import { HistoryProsumerComponent } from '../Charts/history-Prosumer/history-Prosumer.component';
import { RealizationChartProductionComponent } from '../Charts/realization-chart-production/realization-chart-production.component';
import { PredictionProsumerComponent } from '../Charts/prediction-prosumer/prediction-prosumer.component';

@Component({
  selector: 'app-user1',
  templateUrl: './user1.component.html',
  styleUrls: ['./user1.component.css'],
})
export class User1Component implements OnInit, AfterViewInit {
  @ViewChild('tabelaUredjaja', { static: true })
  tabelaUredjaja!: TabelaUredjajaComponent;
  
  @ViewChild('editProsumerProfileForm', {static:true}) editProsumerProfileForm! : EditProsumerFormComponent;

  @ViewChild('prosumerHistory', {static : true}) prosumerHistory! : HistoryProsumerComponent;
  @ViewChild('prosumerHistoryProduction', {static : true}) prosumerHistoryProduction! : RealizationChartProductionComponent;
  @ViewChild('prosumerPrediction', {static : true}) prosumerPrediction! : PredictionProsumerComponent;

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
    private _sanitizer: DomSanitizer,
    private auth: AuthService,
    private toast: ToastrService,
    private profileVisitService : ProsumerProfileVisitService
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

  cities: City[] = [];
  cityId: number = -1;
  cityName: string = '';
  neighborhoods: Neighborhood[] = [];
  neighName: string = '';

  onCurrentValuesReceived(values: [number, number, number, number]) {
    const [consumption, production, deviceCount, realDeviceCount] = values;
    this.deviceCount = deviceCount;
    this.currentConsumption = consumption;
    this.currentProduction = production;
    this.realDeviceCount = realDeviceCount;
  }

  ngOnInit(): void {
    document.getElementById('userInfoDataContainer')!.style.height =
      this.widthService.height + 'px';

    this.letValue = localStorage.getItem('role')!;
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
    this.id = this.router.snapshot.params['id']
    this.user
      .detailsEmployee(this.id)
      .subscribe((data: any) => {
        this.userOldInfo = data;
        // console.log(this.userOldInfo);

        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.username = data.userName;
        this.email = data.email;
        this.address = data.address;
        this.Image(data.image);
        this.Region = localStorage.getItem('region')!;
        this.cityId = data.cityId;
        this.city = data.cityName;
        this.neighName = data.neigborghoodName;
        this.thresholds = {
          '0': { color: '#5875A1', bgOpacity: 0.2, fontSize: '16px' },
        };
        this.prosumerHistory.prosumerUsername = this.username;
        this.prosumerHistoryProduction.prosumerUsername = this.username;
        this.prosumerPrediction.prosumerUsername = this.username;
        this.tabelaUredjaja.setProsumer(this.id, this.firstName+ ' '+this.lastName, this.username);
      });
  }

  ngAfterViewInit(): void {
    document.getElementById('userInfoDataContainer')!.style.height =
      this.widthService.height + 'px';
  }

  DeleteUser() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Confirm you want to delete this user',
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#466471',
      cancelButtonColor: '#8d021f',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result: any) => {
      if (result.value) {
        let refreshDto = new SendRefreshToken(
          this.cookie.get('refresh'),
          localStorage.getItem('username')!,
          localStorage.getItem('role')!
        );
        this.auth.refreshToken(refreshDto).subscribe({
          next: (data) => {
            this.cookie.delete('token', '/');
            this.cookie.delete('refresh', '/');
            this.cookie.set('token', data.token.toString().trim(), {
              path: '/',
            });
            this.cookie.set('refresh', data.refreshToken.toString().trim(), {
              path: '/',
            });
            //update podataka u localStorage
            let decodedToken: any = jwt_decode(data.token);
            localStorage.setItem('username', decodedToken[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
            ].toString().trim());

            localStorage.setItem('role', decodedToken[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ].toString().trim());
              
            localStorage.setItem('id', decodedToken['sub'].toString().trim());

            //brisanje korisnika
            this.user.deleteUser(this.router.snapshot.params['id']).subscribe({
              next: (res) => {
                // console.log(res);
                this.r.navigate(['/DsoApp/users']);
              },
              error: (err) => {
                console.log(err.error);
                this.toast.error('Unable to delete prosumer.', 'Error!', {
                  timeOut: 2500,
                });
              },
            });
          },
          error: (err) => {
            this.auth
              .logout(localStorage.getItem('username')!, localStorage.getItem('role')!)
              .subscribe({
                next: (res) => {
                  this.toast.error(err.error, 'Error!', { timeOut: 3000 });
                  this.cookie.delete('token', '/');
                  this.cookie.delete('refresh', '/');
                  localStorage.removeItem('region');
                  localStorage.removeItem('lat');
                  localStorage.removeItem('long');
                  localStorage.removeItem('username');
                  localStorage.removeItem('role');
                  localStorage.removeItem('id');
                  this.r.navigate(['login']);
                },
                error: (error) => {
                  console.log(error);
                  this.toast.error('Unknown error occurred', 'Error!', {
                    timeOut: 2500,
                  });
                  this.cookie.delete('token', '/');
                  this.cookie.delete('refresh', '/');
                  localStorage.removeItem('region');
                  localStorage.removeItem('lat');
                  localStorage.removeItem('long');
                  localStorage.removeItem('username');
                  localStorage.removeItem('role');
                  localStorage.removeItem('id');
                  this.r.navigate(['login']);
                },
              });
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Action when Cancel button is clicked
      }
    });
  }

  disableDelete(role: string) {
    let deleteBtn = document.getElementById('delete');
    if (role == 'Admin') {
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
  resetData()
  {
    this.getInformations();
    document.getElementById('closeModalEditProsumerData')!.click();
  }
  openEdit()
  {
    this.editProsumerProfileForm.setIdData(this.id, this.userOldInfo);
    document.getElementById('openEditFormProsumer')!.click();
  }
}
