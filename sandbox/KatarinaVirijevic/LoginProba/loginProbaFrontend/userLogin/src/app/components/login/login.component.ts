import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  type: string ="password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthServiceService, private router: Router) { }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    })
  }

  hideShowPass()
  {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText ? this.type = 'text' : this.type = 'password';
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
            this.router.navigate(['dashboard']);
          },
          error:(err)=>{
            alert(err.error.message);
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
}
