import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  loginForm!: FormGroup;
  isText: boolean = false;
  type: string ="password";
  eyeIcon: string = "fa-eye-slash";

  constructor(private fb: FormBuilder, private router: Router, private toast: NgToastService, private cookie: CookieService, private auth: AuthServiceService) { }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['',Validators.required],
      password: ['',Validators.required]
    })
  }

  hideShowPass()
  {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText ? this.type = 'text' : this.type = 'password';
  }

  private validateAllFormFields(formGroup: FormGroup)
  {
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl)
      {
        control.markAsDirty({onlySelf:true});
      }
      else if(control instanceof FormGroup)
      {
        this.validateAllFormFields(control);
      }
    })
  }

  onSubmit()
  {
    if(this.loginForm.valid)
    {
      console.log(this.loginForm.value);
      //poslati beku

      this.auth.login(this.loginForm.value)
      .subscribe(
        /*response => {
          alert(response.message);
          //this.getAllWorkers();
        }*/
        {
          next:(res)=>{
            //alert(res.message);
            this.loginForm.reset();
            this.cookie.set("token",res.token);
            this.toast.success({detail:"Successful Login!",duration: 2000});
            this.router.navigate([""]);
          },
          error:(err)=>{
            //alert(err.error.message);
            this.toast.error({detail:"ERROR", summary: err.error.message,duration: 3000});
          }
        }
      );
    }
    else
    {
      //console.log("Form is not valid!");
      this.validateAllFormFields(this.loginForm);
      //alert("Your form is invalid!");
    }
  }
}
