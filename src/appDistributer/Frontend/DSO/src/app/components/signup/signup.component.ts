import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  type:string="password";
  isText:boolean=false;
  eyeIcon: string = "fa-eye-slash";
  imageUrl:string="/assets/images/default-image.png";
  latitude: string = ''
  longitude: string = ''

  signupForm!:FormGroup;
  constructor(private fb:FormBuilder,private auth : AuthService,private router:Router,private toast: NgToastService,){}
  ngOnInit(): void {
    this.signupForm=this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      password:['',Validators.required],
      email:['',Validators.required],
      address:['',Validators.required],
      image:['',Validators.required],
    })
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
  hideShowPass(){
    this.isText=!this.isText;
    this.isText? this.eyeIcon="fa-eye":this.eyeIcon="fa-eye-slash";
    this.isText? this.type="text":this.type="password";

  }
  get fields(){
    return this.signupForm.controls;
  }
  
  onSignUp(){
    if(this.signupForm.valid){
      //this.getCoordinates();
      //uzete koordinate poslati beku zajedno sa formom - implementirati!!!
      this.auth.signUp(this.signupForm.value)
      .subscribe({
        next:(res=>{
          alert(res);
          this.signupForm.reset();
          //this.router.navigate(['']);
        })
        ,error:(err=>{
          alert(err?.error)
        })
      })
      console.log(this.signupForm.value);
    }
    else{
      this.validateAllFormFields(this.signupForm)
    }
  }
  private validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control=formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }
      else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }

  private getCoordinates()
  {
    var address = 'Atinska 18,Kragujevac,Serbia'; //ulica i broj,grad,drzava - implementirat!!! (hardkodirano je trenutno)
    var key='Ag6ud46b-3wa0h7jHMiUPgiylN_ZXKQtL6OWJpl6eVTUR5CnuwbUF7BYjwSA4nZ_';
    var url = 'https://dev.virtualearth.net/REST/v1/Locations?query=' + encodeURIComponent(address)+ '&key=' + key;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      // Extract the latitude and longitude from the response
      var location = data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
      this.latitude = location[0];
      this.longitude = location[1];

        // create a marker at the location
        //var markerUser = L.marker([latitude, longitude],{ icon: defaultIcon });

        // center the map on the marker
        //markerUser.addTo(this.map);
      })
      .catch(error => {
        this.toast.error({
          detail: 'ERROR',
          summary: 'Error fetching location data.',
          duration: 3000,
        });
        console.error(`Error fetching location data: ${error}`);
      });
  }
  
}
