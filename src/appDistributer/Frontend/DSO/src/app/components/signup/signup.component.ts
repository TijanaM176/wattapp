import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { RegisterProsumerDto } from 'src/app/models/registerProsumerDto';
import { SetCoordsDto } from 'src/app/models/setCoordsDto';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Neighborhood } from 'src/app/models/neighborhood';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  cities: any = [];
  neighborhoods: Neighborhood[] = [];
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  latitude: string = '';
  longitude: string = '';
  CityId: string = '';
  NeighborhoodId: string = '';
  address: string = '';

  signupForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private service: UsersServiceService
  ) {}
  ngOnInit(): void {
    this.service.getAllCities().subscribe((response) => {
      this.cities = response;
    });
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
  getAllNeighborhoodById() {
    this.service
      .getAllNeighborhoodByCityId(this.CityId)
      .subscribe((response) => {
        this.neighborhoods = response;
      });
  }

  /*
  handleFileInput(event:any){

    if(event.target.files[0]){
      let reader=new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.imageUrl=event.target.result;
      }
    }
  }
  */
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
          //this.router.navigate(['']);
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
