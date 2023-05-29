import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
import { SendRefreshToken } from 'src/app/models/sendRefreshToken';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import jwt_decode from 'jwt-decode';
import { NewEmployeeAddedService } from 'src/app/services/new-employee-added.service';

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
  currentRoute!: string;
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
    private http: HttpClient,
    private newEmplSer : NewEmployeeAddedService
  ) {}

  ngOnInit(): void {
    this.signupWorkerForm = this.fb.group({
      salary: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      passwordAgain:['',Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^([\w.-]+)@([\w-]+)((.(\w){2,3})+)(.com)$/)]],
      image64String: [this.croppedImage],
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
    this.resetAll();
  }
  closeChange() {
    document.getElementById('openAgain')!.click();
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
      this.file = true;
      this.signupWorkerForm.value.image64String = this.croppedImage.replace(
        'data:image/png;base64,',
        ''
      );

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
    this.signupWorkerForm.value.image64String = this.croppedImage.replace(
      'data:image/png;base64,',
      ''
    );
    this.signupWorkerForm.value.salary = Number(
      this.signupWorkerForm.value.salary
    );
    
    if (this.signupWorkerForm.valid) {
      let refrestDto : SendRefreshToken = new SendRefreshToken(this.cookie.get('refresh'), localStorage.getItem('username')!, localStorage.getItem('role')!);
      this.auth.refreshToken(refrestDto)
      .subscribe({
        next:(res)=>{
          this.cookie.delete('token','/');
          this.cookie.delete('refresh','/');
          this.cookie.set('token', res.token.toString().trim(), {path: '/'});
          this.cookie.set('refresh',res.refreshToken.toString().trim(), {path:'/'});

          //update podataka u localStorage
          let decodedToken: any = jwt_decode(res.token);
          localStorage.setItem('username', decodedToken[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
          ].toString().trim());

          localStorage.setItem('role', decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ].toString().trim());
          
          localStorage.setItem('id', decodedToken['sub'].toString().trim());
          this.auth.signupWorker(this.signupWorkerForm.value).subscribe({
            next: (res) => {
              this.newEmplSer.add(res.id);
              this.toast.success('New Employee Added!', 'Success', {
                timeOut: 2500,
              });
              this.signupWorkerForm.reset();
              this.deleteselectimage();
              this.currentRoute=this.router.url;
              if (this.router.url === '/DsoApp/employees') {
                this.router.navigate(['/DsoApp/users'],{skipLocationChange:true}).then(()=>{
                  this.router.navigate(['/DsoApp/employees']);
                });
              }
              else
              {
                this.router.navigate(['/DsoApp/employees']);
              }
              document.getElementById('closebutton')!.click();
            },
            error: (err) => {
              this.toast.error(err.error, 'Error!', {
                timeOut: 2500,
              });
              console.log(err);
            },
          });
        },
        error:(err)=>{
          if(err instanceof HttpErrorResponse && err.status == 401)
          {
            this.auth.logout(localStorage.getItem('username')!, localStorage.getItem('role')!)
            .subscribe({
              next:(res)=>{
                this.toast.error(err.error, 'Error!', {timeOut: 3000});
                this.cookie.delete('token', '/');
                this.cookie.delete('refresh', '/');
                localStorage.removeItem('region');
                localStorage.removeItem('lat');
                localStorage.removeItem('long');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                localStorage.removeItem('id');
                this.router.navigate(['login']);
              },
              error:(error)=>{
                console.log('logout', error);
                this.toast.error('Unknown error occurred. Logging out..', 'Error!', {timeOut: 2500});
                this.cookie.delete('token', '/');
                this.cookie.delete('refresh', '/');
                localStorage.removeItem('region');
                localStorage.removeItem('lat');
                localStorage.removeItem('long');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                localStorage.removeItem('id');
                this.router.navigate(['login']);
              }
            });
          }
          else
          {
            this.toast.error('Unknown error occurred. Try again later.', 'Error!', {timeOut: 2500});
          }
        }
      });
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
