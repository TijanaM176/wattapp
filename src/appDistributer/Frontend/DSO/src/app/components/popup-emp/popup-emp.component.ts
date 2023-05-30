import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { RegisterProsumerDto } from 'src/app/models/registerProsumerDto';
import { SetCoordsDto } from 'src/app/models/setCoordsDto';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Neighborhood } from 'src/app/models/neighborhood';
import { City } from 'src/app/models/city';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { SendRefreshToken } from 'src/app/models/sendRefreshToken';
import { HttpErrorResponse } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-popup-emp',
  templateUrl: './popup-emp.component.html',
  styleUrls: ['./popup-emp.component.css'],
})
export class PopupEmpComponent implements OnInit {
  neighName: string = '';
  cities: City[] = [];
  neighborhood: string = '';
  neighborhoods: Neighborhood[] = [];
  type: string = 'password';
  currentRoute!: string;
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  latitude: string = '';
  longitude: string = '';
  NeighborhoodId: string = '';
  address: string = '';
  cityId: number = -1;
  cityName: string = '';

  signupForm!: FormGroup;
  signupFormValues!: FormGroup;
  closeResult: string = '';
  users: any;
  showModal: boolean = false;
  currentCountry: string = '';
  validInput: boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public toast: ToastrService,
    private service: UsersServiceService,
    private location1: Location,
    private serviceData: DataService,
    private cookie : CookieService
  ) {}
  ngOnInit(): void {
    this.serviceData.getAllCities().subscribe((response) => {
      this.cities = response;
    });
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      passwordAgain:['',Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^([\w.-]+)@([\w-]+)((.(\w){2,3})+)(.com)$/)]],
      neigbName: [this.neighName],
      address: ['', Validators.required],
      city: [''],
    });
    this.signupForm.removeControl('s');
  }
  getAllNeighborhoodById(e: any) {
    this.cityId = e.target.value;
    this.serviceData.getCityNameById(this.cityId).subscribe((response) => {
      this.cityName = response;
    });
    this.serviceData
      .getAllNeighborhoodByCityId(this.cityId)
      .subscribe((response) => {
        this.neighborhoods = response;
      });
  }
  getNeighId(e: any) {
    this.neighName = e.target.value;
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  get fields() {
    return this.signupForm.controls;
  }
  close() {
    this.signupForm.reset();
  }
  onSignUp() {
    if (this.signupForm.valid) {
      this.address =
        this.signupForm.value.address.trim() +',' +this.signupForm.value.city.trim() +',' +'Serbia';
      
      this.address = this.address.replaceAll('dj', 'đ');

      var key =
        'Ag6ud46b-3wa0h7jHMiUPgiylN_ZXKQtL6OWJpl6eVTUR5CnuwbUF7BYjwSA4nZ_';
      var url =
        'https://dev.virtualearth.net/REST/v1/Locations?query=' +
        encodeURIComponent(this.address) +
        '&key=' + key;

      fetch(url)
        .then((response) => response.json())
        .then((data) => { //uspesno nadjena adresa
          var location = data.resourceSets[0].resources[0].geocodePoints[0].coordinates;

          let refrestDto : SendRefreshToken = new SendRefreshToken(this.cookie.get('refresh'), localStorage.getItem('username')!, localStorage.getItem('role')!);
          this.auth.refreshToken(refrestDto)
          .subscribe({
            next:(res)=>{
              this.cookie.delete('token','/');
              this.cookie.delete('refresh','/');
              this.cookie.set('token', res.token.toString().trim(), {path: '/'});
              this.cookie.set('refresh',res.refreshToken.toString().trim(), {path:'/'});

              //update podataka u localStorage
              let decodedToken: any = jwt_decode(res.token);
              localStorage.setItem('username', decodedToken[
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
              ]
                .toString()
                .trim());

              localStorage.setItem('role', decodedToken[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
              ]
                .toString()
                .trim());
              
              localStorage.setItem('id', decodedToken['sub'].toString().trim());

              this.auth.signUp(this.signupForm.value).subscribe({
                next: (res) => {
                  // console.log(res);
                  this.getCoordinates(location, res.username, res.id);
                },
                error: (err) => {
                  this.toast.error('Error!', 'Unable to add new Prosumer. Try again later.', {
                    timeOut: 2500,
                  });
                  this.signupForm.reset();
                  document.getElementById('closebttn')!.click();
                },
              });
            },
            error:(err)=>{
              if(err instanceof HttpErrorResponse && err.status == 401)
              {
                this.signupForm.reset();
                document.getElementById('closebttn')!.click();
                this.auth.logout(localStorage.getItem('username')!, localStorage.getItem('role')!)
                .subscribe({
                  next:(res)=>{
                    this.toast.error(err.error, 'Error!', {timeOut: 3000});
                    this.cookie.delete('token', '/');
                    this.cookie.delete('refresh', '/');
                    localStorage.removeItem('region');
                    localStorage.removeItem('lat');
                    localStorage.removeItem('long');
                    localStorage.removeItem('username');
                    localStorage.removeItem('role');
                    localStorage.removeItem('id');
                    this.router.navigate(['login']);
                  },
                  error:(error)=>{
                    console.log('logout', error);
                    this.toast.error('Unknown error occurred. Logging out..', 'Error!', {timeOut: 2500});
                    this.cookie.delete('token', '/');
                    this.cookie.delete('refresh', '/');
                    localStorage.removeItem('region');
                    localStorage.removeItem('lat');
                    localStorage.removeItem('long');
                    localStorage.removeItem('username');
                    localStorage.removeItem('role');
                    localStorage.removeItem('id');
                    this.router.navigate(['login']);
                  }
                });
              }
              else
              {
                this.toast.error('Unknown error occurred. Try again later.', 'Error!', {timeOut: 2500});
                this.signupForm.reset();
                document.getElementById('closebttn')!.click();
              }
            }
          });
        })
        .catch((error) => {
          this.toast.error('This address does not exist. Make sure address input is correct.', 'Error!', {
            timeOut: 2500,
          });
          console.error(`Error fetching location data: ${error}`);
        });
    } else {
      this.validateAllFormFields(this.signupForm);
    }
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      }
    });
  }

  private getCoordinates(location : any, username: string, id :string) {
    let coordsDto = new SetCoordsDto();
    coordsDto.Username = username;
    coordsDto.Latitude = location[0].toString();
    coordsDto.Longitude = location[1].toString();
    this.auth.setUserCoordinates(coordsDto).subscribe({
      next: (res) => {
        // console.log(res.message);
        this.toast.success('Prosumer successfully added.', 'Success!', {timeOut:2500});
        this.router.navigate(['/DsoApp/user/'+id]);
        this.signupForm.reset();
        document.getElementById('closebttn')!.click();
      },
      error: (err) => {
      this.toast.error('Error!', 'Unable to save coordinates.', {
        timeOut: 2500,
            });
        this.signupForm.reset();
        document.getElementById('closebttn')!.click();
      },
    });
  }
}
