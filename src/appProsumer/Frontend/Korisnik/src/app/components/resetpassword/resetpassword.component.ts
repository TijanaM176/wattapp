import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ResetPassword } from 'src/app/models/reset-password';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
})
export class ResetpasswordComponent {
  resetForm!: FormGroup;
  isValid!: boolean;
  isText: boolean = false;
  type: string = 'password';
  eyeIcon: string = 'fa-eye-slash';
  constructor(
    private fb: FormBuilder,
    private reset: ResetPasswordService,
    private cookie: CookieService,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    this.resetForm = this.fb.group({
      password1: ['', Validators.required],
      password2: ['', Validators.required],
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
  checkValid() {
    const pattern = /^(([A-Za-z0-9]){6,20})$/;

    this.isValid = pattern.test(this.resetForm.value.password1);
    if (this.isValid) {
      //console.log('prosao regex');
      return this.resetForm.value.password1 == this.resetForm.value.password2;
    }
    return this.isValid;
  }
  Reset() {
    if (this.checkValid()) {
      var object = new ResetPassword();
      object.password = this.resetForm.value.password1;
      object.confirmPassword = this.resetForm.value.password2;
      object.token = this.cookie.get('resetTokenProsumer');
      this.reset.resetPassword(object).subscribe((res: any) => {
        this.cookie.delete('resetTokenProsumer', '/');
        if (res.error == false) {
          this.toast.success('Succes', 'Succesful resset password', {
            timeOut: 3000,
          });
        } else {
          this.toast.error('ERROR', 'Unable to resset password.', {
            timeOut: 3000,
          });
        }
      });
    }
  }
}
