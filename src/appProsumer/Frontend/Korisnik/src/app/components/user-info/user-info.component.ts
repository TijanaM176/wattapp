import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordComponent } from 'src/app/forms/change-password/change-password.component';
import { EditInfoFormComponent } from 'src/app/forms/edit-info-form/edit-info-form.component';
import { Location } from "@angular/common";
import { ProsumerService } from 'src/app/services/prosumer.service';
import { DomSanitizer } from '@angular/platform-browser';
import {HttpEventType} from '@angular/common/http'
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { SendPhoto } from 'src/app/models/sendPhoto';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit, AfterViewInit {
  username: string = '';
  firstLastName: string = '';
  email: string = '';
  address: string = '';
  city: string = '';
  neighborhood: string = '';

  image : string = '';

  changeImage : string = '';
  imgChangeEvt: any = '';
  croppedImage : any = '';
  
  selectedImageFile : any = null;

  loader: boolean = true;
  modalTitle: string = '';
  userData: any;
  showEdit: boolean = false;
  showChangePass: boolean = false;

  @ViewChild('editData', { static: false }) editData!: EditInfoFormComponent;
  @ViewChild('changePassword', { static: false }) changePassword!: ChangePasswordComponent;

  @ViewChild('imageToCrop',{ static: false }) imageToCrop! : ElementRef;

  progress : number = 0;
  success : boolean = false;
  error : boolean = false;
  updating : boolean = false;

  constructor(
    private prosumerService: ProsumerService,
    private toast: ToastrService,
    private cookie: CookieService,
    private sant : DomSanitizer,
    private location: Location,
    public widthService : DeviceWidthService
  ) {
    // this.location.replaceState("/");
  }

  ngAfterViewInit(): void {
    document.getElementById('changeCropProfileImageUserInfoModal')!.style.maxHeight = this.widthService.height * 0.8 + 'px';
  }

  ngOnInit(): void {
    this.getInformation();
    this.activateBtn('offcanvasUserInfo');
    this.activateButton('sidebarUserInfo');
  }

  private getInformation() {
    let id = localStorage.getItem('idProsumer')!;
    this.prosumerService.getInforamtion(id).subscribe({
      next: (res) => {
        // console.log(res);
        this.username = res.userName;
        this.firstLastName = res.firstName + ' ' + res.lastName;
        this.email = res.email;
        this.address = res.address;
        this.Image(res.image);
        this.prosumerService.cityId = res.cityId;
        this.prosumerService.neighId = res.neigborhoodId;
        this.City();
        this.Neighborhood();
        this.userData = res;
      },
      error: (err) => {
        this.toast.error('Unable to load user data.', 'Error!',  {
          timeOut: 3000,
        });
        console.log(err.error);
      },
    });
  }

  private City() {
    this.prosumerService.getCityById().subscribe({
      next: (res) => {
        //console.log(res);
        this.city = res;
      },
      error: (err) => {
        this.toast.error('Unable to load user data.', 'Error!', {
          timeOut: 3000,
        });
        console.log(err.error);
      },
    });
  }
  private Neighborhood() {
    this.prosumerService.getNeighborhoodById().subscribe({
      next: (res) => {
        //console.log(res);
        this.neighborhood = res;
      },
      error: (err) => {
        this.toast.error('Unable to load user data.', 'Error!', {
          timeOut: 3000,
        });
        console.log(err.error);
      },
    });
  }
  private Image(resImg : string)
  {
    this.image = 'assets/images/defaultProfileImage.png';
    this.changeImage = this.image;
    if(!(resImg === '' || resImg == null))
    {
      let byteArray = new Uint8Array(
        atob(resImg)
        .split('')
        .map((char)=> char.charCodeAt(0))
      );
      let file = new Blob([byteArray], {type: 'image/png'});
      this.image = URL.createObjectURL(file);
      this.changeImage = this.image;
    }
  }

  changePass() {
    this.changePassword.reset();
    this.modalTitle = 'Change Password';
    this.showChangePass = true;
  }

  close() {
    if (this.showEdit) {
      this.loader = true;
      this.showEdit = false;
      this.getInformation();
      setTimeout(() => {
        this.loader = false;
      }, 2000);
    }
    if (this.showChangePass) {
      this.showChangePass = false;
    }
    this.modalTitle = '';
  }

  confirm() {
    if (this.showEdit) {
      this.editData.editInfo();
    }
    if (this.showChangePass) {
      this.changePassword.changePass();
    }
  }

  onFileSelected(event : any)
  {
    this.imgChangeEvt = event;
    this.resetBoolean();
    if(event.target.files)
    {
      this.selectedImageFile = event.target.files[0];
      // this.changeImage = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.selectedImageFile)) as string;
    }
  }
  confirmImage()
  {
    if(this.selectedImageFile != null)
    {
      this.croppedImage = this.croppedImage.replace('data:image/png;base64,', '');
      // console.log(this.croppedImage);
      let id = localStorage.getItem('idProsumer')!;
      let sp = new SendPhoto(id,this.croppedImage);
      
      this.prosumerService.UploadImage(sp)
      .subscribe({
        next:(res)=>{
          this.success = true;
          this.updating = true;
          setTimeout(()=>{
            this.Image(this.croppedImage);
            document.getElementById('closeCropImadePhotoUpdated')!.click();
            this.closeImageChange();
          },700);
        },
        error:(err)=>{
          document.getElementById('closeCropImadePhotoUpdated')!.click();
          this.toast.error('Unable to update photo','Error!',{timeOut: 3000});
          console.log(err.error);
        }
      });
    }
    else
    {
      this.error = true;
      this.toast.error("No Photo was selected.", 'Error!',{timeOut:3000});
    }
  }
  deleteImage()
  {
    this.prosumerService.DeleteImage()
    .subscribe({
      next:(res)=>{
        this.toast.success('Photo deleted.', 'Success!',{timeOut:2000});
        this.image = 'assets/images/defaultProfileImage.png';
        this.changeImage = this.image;
      },
      error:(err)=>{
        this.toast.error('Unable to delete photo', 'Error', {timeOut:3000});
      }
    })
  }
  closeImageChange()
  {
    this.changeImage = this.image;
    this.selectedImageFile = null;
    this.resetBoolean();
  }
  private resetBoolean()
  {
    this.success = false;
    this.error = false;
    this.updating = false;
  }
  activateBtn(id : string)
  {
    const buttons = document.querySelectorAll('.offcanvasBtn');
    buttons.forEach(button=>{
      if(button.id == id)
      {
        button.classList.add('active');
      }
      else
      {
        button.classList.remove('active');
      }
    })
  }
  activateButton(id : string)
  {
    const buttons = document.querySelectorAll('.sidebarBtn');
    buttons.forEach(button=>{
      if(button.id == id)
      {
        button.classList.add('active');
      }
      else
      {
        button.classList.remove('active');
      }
    });
  }

  openCrop()
  {
    document.getElementById('openCropImageBtn')!.click()
  }

  //za ngx-image-crop
  cropImg(e: ImageCroppedEvent) {
    this.croppedImage = e.base64; //part of the image that is cropped
  }
  resetImageChange()
  {
    this.imgChangeEvt = '';
  }
}
