import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { SendPhoto } from 'src/app/models/sendPhoto';
import { SendPhoto1 } from 'src/app/models/sendPhoto1';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';

@Component({
  selector: 'app-popup-add',
  templateUrl: './popup-add.component.html',
  styleUrls: ['./popup-add.component.css'],
})
export class PopupAddComponent implements OnInit {
  signupWorkerForm!: FormGroup;
  eyeIcon: string = 'fa-eye-slash';
  type: string = 'password';
  isText: boolean = false;
  imgChangeEvet: any = '';
  croppedImage: any = '';
  currentImage: string = 'assets/images/defaultWorker.png';
  selectedImageFile: any = null;
  fileType: any = '';
  errorDeletePhoto: boolean = false;
  updatedPhotoSuccess: boolean = false;
  updatedPhotoError: boolean = false;
  noFile: boolean = false;
  file: boolean = false;
  imageSource!: any;
  imageSource1!: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    public toast: ToastrService,
    public cookie: CookieService,
    private service: EmployeesServiceService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.signupWorkerForm = this.fb.group({
      salary: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      passwordAgain:['',Validators.required],
      email: ['', Validators.required],
      image64String: [''],
    });
  }
  get fields() {
    return this.signupWorkerForm.controls;
  }
  onSignUp() {
    if (this.signupWorkerForm.valid) {
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
  close() {
    this.signupWorkerForm.reset();
  }
  openCrop() {
    document.getElementById('openCropImageBtn2')!.click();
  }
  closeChange() {
    document.getElementById('openAgain')!.click();
    this.resetAll();
  }

  confirmNewPhoto() {
    this.updatedPhotoError = false;
    this.updatedPhotoSuccess = false;
    this.noFile = false;
    if (this.selectedImageFile != null) {
      this.croppedImage = this.croppedImage.replace(
        'data:image/png;base64,',
        ''
      );
      // console.log(this.croppedImage);
      this.file = true;
      // let sp = new SendPhoto1(this.croppedImage);
      // this.signupWorkerForm.value.image64String = sp.base64String;
      this.signupWorkerForm.value.image64String = this.croppedImage.replace('data:image/png;base64,','');

      this.updatedPhotoSuccess = true;
      setTimeout(() => {
        document.getElementById('closeCropImagePhotoUpdated2')!.click();
        this.closeChange();
      }, 700);
    } else {
      this.noFile = true;
      this.file = false;
    }
  }
  deleteselectimage() {
    this.signupWorkerForm.value.image64String = '';
    this.file = false;
    this.resetAll();
  }
  private resetAll() {
    this.errorDeletePhoto = false;
    this.selectedImageFile = null;
    this.imgChangeEvet = '';
    this.croppedImage = '';
    this.updatedPhotoError = false;
    this.updatedPhotoSuccess = false;
    this.noFile = false;
  }
  cropImg(e: ImageCroppedEvent) {
    this.croppedImage = e.base64;
  }
  onFileSelected(event: any) {
    this.imgChangeEvet = event;
    if (event.target.files) {
      this.selectedImageFile = event.target.files[0];
      this.fileType = event.target.files[0].type;
      // this.changeImage = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.selectedImageFile)) as string;
    }
  }
  onSubmit() {
    this.signupWorkerForm.value.image64String = this.croppedImage.replace('data:image/png;base64,','');
    this.signupWorkerForm.value.salary = Number(
      this.signupWorkerForm.value.salary
    );
    
    if (this.signupWorkerForm.valid) {
      this.auth.signupWorker(this.signupWorkerForm.value).subscribe({
        next: (res) => {
          this.toast.success('Success', 'New Employee Added!', {
            timeOut: 2500,
          });
          this.signupWorkerForm.reset();
          this.deleteselectimage();
        },
        error: (err) => {
          this.toast.error('Error!', 'Unable to add new Employee.', {
            timeOut: 2500,
          });
          console.log(err);
        },
      });
      // console.log(this.signupWorkerForm.value);
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
