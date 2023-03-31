import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import jwt_decode from 'jwt-decode';

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
  public resetPasswordEmail!:string;
  public isValidEmail!:boolean;

  constructor(private fb: FormBuilder,private reset:ResetPasswordService, private router: Router, private toast: NgToastService, private cookie: CookieService, private auth: AuthServiceService) { }
  
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
      //poslati beku
      this.auth.login(this.loginForm.value)
      .subscribe(
        {
          next:(res)=>{
            this.loginForm.reset();
            var decodedToken:any = jwt_decode(res.token);
            //console.log(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
            //console.log(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
            this.cookie.set('username',decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'].toString().trim());
            this.cookie.set('role',decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].toString().trim());
            this.cookie.set("token",res.token.toString().trim());
            this.cookie.set("refresh",res.refreshToken.toString().trim());
            this.toast.success({detail:"Successful Login!",duration: 2000});
            this.router.navigate([""]);
          },
          error:(err)=>{
            this.toast.error({detail:"ERROR", summary: err.error.message,duration: 3000});
          }
        }
      );
    }
    else
    {
      this.validateAllFormFields(this.loginForm);
    }
  }
  checkValidEmail(event:string){
    const value=event;

    const pattern=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail=pattern.test(value);
    return this.isValidEmail;
  }
  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);
      
      this.reset.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next:(res:any)=>{
          this.toast.success({
            detail:'Success',
            summary:'Reset Sucess!',
            duration:3000,
          });
          this.resetPasswordEmail="";
          const buttonRef=document.getElementById("closeBtn");
          buttonRef?.click();
        },
        error:(err:any)=>{
          this.toast.error({
            detail:'ERROR',
            summary:'Something went wrong',
            duration:3000,
          });
        }
      })
    }
  }
  PrivremeniToken(){
    //console.log(this.resetPasswordEmail);
    this.reset.forgotPass(this.resetPasswordEmail)
      .subscribe({
        next:(res)=>{
          //alert(res.message);
          this.cookie.set('resetToken',res.resetToken);
          //console.log(res);
          //console.log(this.resetPasswordEmail);
        },
        error:(err)=>{
          this.toast.error({detail:"ERROR", summary: err.error,duration: 3000});
          console.log(err.error);
        }
      })
  }



}
