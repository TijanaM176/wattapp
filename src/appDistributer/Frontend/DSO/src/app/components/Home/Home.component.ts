import { AfterViewInit, Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ModalDismissReasons,NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  closeResult: string='';
  users: any;
  showModal: boolean = false;
  currentCountry:string = '';
  validInput: boolean = false;

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
    private auth1: AuthServiceService,
    private toast: NgToastService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,

    private service: UsersServiceService,
    private location1: Location
  ) {}

  ngAfterViewInit(): void {
    this.showModal = false;
    this.getState();
  }

  ngOnInit(): void {
    this.getAllUsers();


    this.service.getAllCities().subscribe((response) => {
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
    this.auth1.getUsers().subscribe({
      next: (res) => {
        //console.log(res);
        this.users = res;
      },
      error: (err) => {
        //alert(err.error.message);
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 3000,
        });
      },
    });
  }

  getState()
  {
    if ('geolocation' in navigator) {
      if(!this.cookie.check('country'))
      {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.cookie.set('lat', position.coords.latitude.toString(),{path:'/'});
            this.cookie.set('long', position.coords.longitude.toString(),{path:'/'});
            var url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
            fetch(url)
            .then(response => response.json())
            .then(data => {
              console.log(data.address.country);
              this.cookie.set('country',data.address.country,{path:'/'});
            })
          },
          (error) => {
            // If the user denies permission or an error occurs, handle it appropriately
            console.error("Error getting user's location:", error);
            this.showModal = true;
            /*this.toast.error({
              detail: 'ERROR',
              summary: 'Unable To Get Your Current Location.',
              duration: 3000,
            });*/
          },{ enableHighAccuracy: true, timeout: 100 }
        )
      }
    }
    else {
      // If the browser does not support the Geolocation API, handle it appropriately
      this.showModal = true;
      this.toast.error({
        detail: 'ERROR',
        summary: 'Geolocation is not supported by this browser.',
        duration: 3000,
      });
    }
  }

  SaveCountry()
  {
    if(this.currentCountry!="")
    {
      this.cookie.set('country',this.currentCountry,{path:'/'});
      this.showModal = false;
    }
  }
  
  Validate($event: any) {
    if(this.currentCountry!="")
    {
      this.validInput=true;
      this.showModal = false;
    }
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
    this.service.getCityNameById(this.cityId).subscribe((response) => {
      this.cityName = response;
    });
    console.log(this.cityId);
    this.service
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
          //alert(res);
          this.toast.success({
            detail: 'Success!',
            summary: 'New Prosumer Added',
            duration: 2500,
          });

          this.getCoordinates(this.address, res.username);
          console.log(res.username);
          this.signupForm.reset();
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/DsoApp/signup']);
            });
        },
        error: (err) => {
          //alert(err?.error)
          this.toast.error({
            detail: 'Error!',
            summary: err.error,
            duration: 3000,
          });
        },
      });
      console.log(this.signupForm.value);
        
    } 
    else {
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
        coordsDto.username = username;
        coordsDto.latitude = location[0].toString();
        coordsDto.longitude = location[1].toString();
        this.auth.setUserCoordinates(coordsDto).subscribe({
          next: (res) => {
            console.log(res.message);
          },
          error: (err) => {
            this.toast.error({
              detail: 'Error!',
              summary: err.error,
              duration: 3000,
            });
          },
        });
      })
      .catch((error) => {
        this.toast.error({
          detail: 'ERROR',
          summary: 'Error fetching location data.',
          duration: 3000,
        });
        console.error(`Error fetching location data: ${error}`);
      });
  }

}

