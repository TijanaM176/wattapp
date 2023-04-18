import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-signup-worker',
  templateUrl: './signup-worker.component.html',
  styleUrls: ['./signup-worker.component.css'],
})
export class SignupWorkerComponent implements OnInit {
  signupWorkerForm!: FormGroup;
  eyeIcon: string = 'fa-eye-slash';
  type: string = 'password';
  isText: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    public toast:ToastrService
  ) {}
  ngOnInit(): void {
    this.signupWorkerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      // address:['',Validators.required],
      salary: ['', Validators.required],
      image: ['', Validators.required],
    });
  }
  get fields() {
    return this.signupWorkerForm.controls;
  }
  onSignUp() {
    if (this.signupWorkerForm.valid) {
      console.log(this.signupWorkerForm.value);
    } else {
      this.validateAllFormFields(this.signupWorkerForm);
    }
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
    if (this.signupWorkerForm.valid) {
      this.auth.signupWorker(this.signupWorkerForm.value).subscribe({
        next: (res) => {
          this.toast.success('Success','New Employee Added',{timeOut:2500});
          this.signupWorkerForm.reset();
          //this.router.navigate(['']);
        },
        error: (err) => {
          this.toast.error('Error!', 'Unable to add new employee.', {
            timeOut: 2500,
          });
        },
      });
      console.log(this.signupWorkerForm.value);
    } else {
      this.validateAllFormFields(this.signupWorkerForm);
    }
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
}
