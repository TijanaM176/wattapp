// import { NgToastService } from 'ng-angular-popup';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { EmployeesServiceService } from 'src/app/services/employees-service.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ChangeWorkerPasswordComponent } from 'src/app/forms/change-worker-password/change-worker-password.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-worker-profile',
  templateUrl: './worker-profile.component.html',
  styleUrls: ['./worker-profile.component.css'],
})
export class WorkerProfileComponent implements OnInit, AfterViewInit {
  worker: any;
  side: any;
  sadrzaj: any;
  loader: boolean = true;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  role: string = '';
  region: string = '';
  startedWorking : string = '';

  imgChangeEvet: any = '';
  croppedImage: any = '';
  currentImage : string = '';
  errorDeletePhoto : boolean = false;

  @ViewChild('changePasswordWorkerForm', {static : true}) changePasswordWorkerForm! : ChangeWorkerPasswordComponent;

  constructor(
    private workerService: EmployeesServiceService,
    private cookie: CookieService,
    public toast: ToastrService,
    private widthService: ScreenWidthService,
    private employeeService : EmployeesServiceService
  ) {}

  ngAfterViewInit(): void {
    // this.sadrzaj.style.height = this.widthService.height * 0.6 + 'px';
    this.side.style.height = this.widthService.height * 0.7 + 'px';
  }

  ngOnInit(): void {
    this.sadrzaj = document.getElementById('sadrzaj');
    this.side = document.getElementById('side');
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      // this.sadrzaj.style.height = this.widthService.height * 0.6 + 'px';
      this.side.style.height = this.widthService.height * 0.7 + 'px';
    });
    this.getInfo();
    if (this.cookie.get('role') == 'Dso') {
      this.role = 'Admin';
    } else if (this.cookie.get('role') == 'WorkerDso') {
      this.role = 'Employee';
    }
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }

  private getInfo() {
    let id = this.cookie.get('id');

    this.workerService.detailsEmployee(id).subscribe({
      next: (res) => {
        this.worker = res;
        // console.log(this.worker.image);
        this.Image(this.worker.image);
        let date = new Date(this.worker.prosumerCreationDate);
        this.startedWorking = date.getDay() + '. ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear() + '.';
        this.region = this.cookie.get('region');
      },
      error: (err) => {
        console.log(err.error);
        this.toast.error('Error!', 'Unable to get Region Name.', {
          timeOut: 2500,
        });
      },
    });
  }

  private Image(image : any)
  {
    this.currentImage = 'assets/images/employee-default-pfp.png';
    if(image != "" && image != null)
    {
      let byteArray = new Uint8Array(
        atob(image)
        .split('')
        .map((char)=> char.charCodeAt(0))
      );
      let file = new Blob([byteArray], {type: 'image/png'});
      this.currentImage = URL.createObjectURL(file);
    }
  }

  OpenChangePassword()
  {
    document.getElementById('openChangePasswordWorkerPRofile')!.click();
  }
  closeChange()
  {
    document.getElementById('openWorkerProfileAgain')!.click()
  }
  confirmNewPassword()
  {
    this.changePasswordWorkerForm.changePassword();
  }
  
  openChangePhoto()
  {
    this.errorDeletePhoto = false;
    document.getElementById('openChangePhotoWorkerProfile')!.click();
  }
  confirmNewPhoto()
  {

  }
  deleteImage()
  {
    this.errorDeletePhoto = false;
    this.employeeService.deleteProfilePhoto(this.cookie.get('id'))
    .subscribe({
      next:(res)=>{
        this.currentImage = 'assets/images/employee-default-pfp.png';
        document.getElementById('closeOprionsForPhoto')!.click();
      },
      error:(err)=>{
        this.errorDeletePhoto = true;
        console.log(err.error);
      }
    });
  }
  onFileChange(event: any): void {
    this.imgChangeEvet = event;
  }
  cropImg(e: ImageCroppedEvent) {
    this.croppedImage = e.base64;
  }
}
