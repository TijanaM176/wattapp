import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
// import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import jwt_decode from 'jwt-decode';
import { path } from 'd3';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;
  messageHTML!: SafeHtml;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookie: CookieService,
    private auth: AuthService,
    private reset: ResetPasswordService,
    public toast: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cookie.delete('token', '/');
    this.cookie.delete('refresh', '/');
    this.cookie.delete('id', '/');
    this.cookie.delete('role', '/');
    this.cookie.delete('username', '/');
    this.cookie.delete('lat', '/');
    this.cookie.delete('long', '/');
    this.cookie.delete('acc', '/');
    this.cookie.delete('country', '/');
    this.cookie.deleteAll();
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
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
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          //alert(res.message);
          this.cookie.deleteAll();
          this.loginForm.reset();
          var decodedToken: any = jwt_decode(res.token);
          this.cookie.set(
            'username',
            decodedToken[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
            ]
              .toString()
              .trim(),
            { path: '/' }
          );
          this.cookie.set(
            'role',
            decodedToken[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ]
              .toString()
              .trim(),
            { path: '/' }
          );
          this.cookie.set('id', decodedToken['sub'].toString().trim(), {
            path: '/',
          });
          this.cookie.set('token', res.token.toString().trim(), { path: '/' });
          this.cookie.set('refresh', res.refreshToken.toString().trim(), {
            path: '/',
          });
          this.toast.success('Success', 'Successful Login!', { timeOut: 2500 });
          this.router.navigate(['']);
        },
        error: (err) => {
          this.toast.error('Error!', 'Unable to Login.', {
            timeOut: 2500,
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
    const resetPasswordUrl = 'http://softeng.pmf.kg.ac.rs:10072/resetpassword'; // Replace with your reset password URL
    //const encodedResetPasswordUrl = this.sanitizer.bypassSecurityTrustUrl(resetPasswordUrl);

    const resetPasswordLink = `<a href="${resetPasswordUrl}">Reset Password</a>`;

    //const message = `${resetPasswordLink}`;
    //this.messageHTML = this.sanitizer.bypassSecurityTrustHtml(message);
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      //console.log(this.resetPasswordEmail);
      this.auth.sendResetPasswordLink(this.resetPasswordEmail,resetPasswordLink).subscribe({
        next: (res) => {
          this.toast.success('Success', 'Email is sent', {
            timeOut: 2500,
          });
          this.resetPasswordEmail = '';
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
        },
        error: (err) => {
          this.toast.error('Error!', 'Unable to send email.', {
            timeOut: 2500,
          });
        },
      });
    }
  }

  PrivremeniToken() {
    //console.log(this.resetPasswordEmail);
    this.auth.forgotPass(this.resetPasswordEmail).subscribe({
      next: (res) => {
        //alert(res.message);
        this.cookie.set('resetToken', res.resetToken, { path: '/' });
        //console.log(res);
        //console.log(this.resetPasswordEmail);
      },
      error: (err) => {
        this.toast.error('Error!', 'Error.', {
          timeOut: 3000,
        });
        console.log(err.error);
      },
    });
  }
}
