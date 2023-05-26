import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isText: boolean = false;
  type: string = 'password';
  eyeIcon: string = 'fa-eye-slash';
  isLoginBtnDisabled : boolean = false;
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  constructor(
    private fb: FormBuilder,
    private reset: ResetPasswordService,
    private router: Router,
    private toast: ToastrService,
    private cookie: CookieService,
    private auth: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.isLoginBtnDisabled = false;
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      //poslati beku
      this.isLoginBtnDisabled = true;
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loginForm.reset();
          var decodedToken: any = jwt_decode(res.token);

          localStorage.setItem('usernameProsumer', decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
          .toString().trim());
          
          localStorage.setItem('roleProsumer',decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          .toString().trim());

          localStorage.setItem('idProsumer', decodedToken['sub'].toString().trim());

          this.cookie.set('tokenProsumer', res.token.toString().trim(), { path: '/' });
          this.cookie.set('refreshProsumer', res.refreshToken.toString().trim(), {
            path: '/',
          });
          this.toast.success('Successful Login!', '', { timeOut: 2000 });
          this.router.navigate(['']);
        },
        error: (err) => {
          this.isLoginBtnDisabled = false;
          this.toast.error('ERROR', err.error.message, {
            timeOut: 3000,
          });
        },
      });
    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }
  checkValidEmail(event: string) {
    const value = event;

    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
  confirmToSend() {
    const resetPasswordUrl = 'http://softeng.pmf.kg.ac.rs:10073/resetpassword'; 
    const resetPasswordLink = `<a href="${resetPasswordUrl}">Reset Password</a>`;

    if (this.checkValidEmail(this.resetPasswordEmail)) {
      console.log(this.resetPasswordEmail);

      this.reset.sendResetPasswordLink(this.resetPasswordEmail,resetPasswordLink).subscribe({
        next: (res: any) => {
          this.toast.success('Success', 'Email is sent', {
            timeOut: 3000,
          });
          this.resetPasswordEmail = '';
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
        },
        error: (err: any) => {
          this.toast.error('ERROR', 'Unable to send email.', {
            timeOut: 3000,
          });
        },
      });
    }
  }
  PrivremeniToken() {
    //console.log(this.resetPasswordEmail);
    this.reset.forgotPass(this.resetPasswordEmail).subscribe({
      next: (res) => {
        this.cookie.set('resetTokenProsumer', res.resetToken, { path: '/' });
      },
      error: (err) => {
        this.toast.error('ERROR', err.error, {
          timeOut: 3000,
        });
        console.log(err.error);
      },
    });
  }
}
