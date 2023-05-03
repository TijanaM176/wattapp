import {
  AfterViewInit,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Location } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { RegisterProsumerDto } from 'src/app/models/registerProsumerDto';
import { SetCoordsDto } from 'src/app/models/setCoordsDto';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Neighborhood } from 'src/app/models/neighborhood';
import { City } from 'src/app/models/city';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  closeResult: string = '';
  users: any;
  showModal: boolean = false;
  currentCountry: string = '';
  validInput: boolean = false;
  loader: boolean = true;

  @ViewChild('exampleModal', { static: false }) modal!: ElementRef;
  @ViewChild('launchButton') launchButton!: ElementRef;

  neighName: string = '';
  cities: City[] = [];
  neighborhood: string = '';
  neighborhoods: Neighborhood[] = [];
  type: string = 'password';
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

  constructor(
    private cookie: CookieService,
    private serviceUser: UsersServiceService,
    public toast: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private serviceData: DataService,
    private service: UsersServiceService,
    private location1: Location
  ) {}

  ngAfterViewInit(): void {
    this.showModal = false;
  }

  ngOnInit(): void {
    this.getAllUsers();

    this.serviceData.getAllCities().subscribe((response) => {
      this.cities = response;
    });
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      neigbName: [this.neighName],
      address: ['', Validators.required],
      city: [''],
      image: [''],
    });
    this.signupForm.removeControl('s');
  }

  LogOut() {
    this.cookie.deleteAll();
    this.router.navigate(['login']);
  }

  getAllUsers() {
    this.serviceUser.getUsers().subscribe({
      next: (res) => {
        //console.log(res);
        this.users = res;
      },
      error: (err) => {
        alert(err.error.message);
        this.toast.error('Error', '', {
          timeOut: 3000,
        });
      },
    });
  }

  Validate($event: any) {
    if (this.currentCountry != '') {
      this.validInput = true;
      this.showModal = false;
    }
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then
      // (result) => {
      //   this.closeResult = `Closed with: ${result}`;
      // },
      // (reason) => {
      //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // }
      ();
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllNeighborhoodById(e: any) {
    this.cityId = e.target.value;
    this.serviceData.getCityNameById(this.cityId).subscribe((response) => {
      this.cityName = response;
    });
    console.log(this.cityId);
    this.serviceData
      .getAllNeighborhoodByCityId(this.cityId)
      .subscribe((response) => {
        this.neighborhoods = response;
      });
  }
  getNeighId(e: any) {
    this.neighName = e.target.value;
    console.log(this.neighName);
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  get fields() {
    return this.signupForm.controls;
  }

  onSignUp() {
    if (this.signupForm.valid) {
      this.address =
        this.signupForm.value.address.trim() +
        ',' +
        this.signupForm.value.city.trim() +
        ',' +
        'Serbia';

      this.auth.signUp(this.signupForm.value).subscribe({
        next: (res) => {
          this.toast.success('Success', 'New Prosumer Added', {
            timeOut: 2500,
          });

          this.getCoordinates(this.address, res.username);
          console.log(res.username);
          this.signupForm.reset();
          window.location.reload();
        },
        error: (err) => {
          this.toast.error('Error!', 'Unable to add new prosumer.', {
            timeOut: 2500,
          });
        },
      });
      console.log(this.signupForm.value);
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

  private getCoordinates(address: string, username: string) {
    var key =
      'Ag6ud46b-3wa0h7jHMiUPgiylN_ZXKQtL6OWJpl6eVTUR5CnuwbUF7BYjwSA4nZ_';
    var url =
      'https://dev.virtualearth.net/REST/v1/Locations?query=' +
      encodeURIComponent(address) +
      '&key=' +
      key;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Extract the latitude and longitude from the response
        var location =
          data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
        /*this.latitude = location[0];
      this.longitude = location[1];*/
        let coordsDto = new SetCoordsDto();
        coordsDto.Username = username.toString();
        coordsDto.Latitude = location[0].toString();
        coordsDto.Longitude = location[1].toString();
        this.auth.setUserCoordinates(coordsDto).subscribe({
          next: (res) => {
            console.log(res.message);
          },
          error: (err) => {
            this.toast.error('Error!', 'Unable to set user coordinates.', {
              timeOut: 2500,
            });
          },
        });
      })
      .catch((error) => {
        this.toast.error('Error!', 'Unable to fetch location data.', {
          timeOut: 2500,
        });
        console.error(`Error fetching location data: ${error}`);
      });
  }
}
