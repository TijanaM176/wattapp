import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordComponent } from 'src/app/forms/change-password/change-password.component';
import { EditInfoFormComponent } from 'src/app/forms/edit-info-form/edit-info-form.component';
import { EditableInfo } from 'src/app/models/editableInfo';
import { SendPhoto } from 'src/app/models/sendPhoto';
import { ProsumerService } from 'src/app/services/prosumer.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  username: string = '';
  firstLastName: string = '';
  email: string = '';
  address: string = '';
  city: string = '';
  neighborhood: string = '';
  image : string = '';
  changeImage : string = '';
  selectedImageFile : any = null;
  loader: boolean = true;
  modalTitle: string = '';
  userData: any;
  showEdit: boolean = false;
  showChangePass: boolean = false;

  @ViewChild('editData', { static: false }) editData!: EditInfoFormComponent;
  @ViewChild('changePassword', { static: false }) changePassword!: ChangePasswordComponent;

  progress : number = 0;
  success : boolean = false;
  error : boolean = false;
  updating : boolean = false;

  constructor(
    private prosumerService: ProsumerService,
    private toast: ToastrService,
    private cookie: CookieService,
    private sant : DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getInformation();
  }

  private getInformation() {
    this.prosumerService.getInforamtion(this.cookie.get('id')).subscribe({
      next: (res) => {
        // console.log(res);
        this.username = res.username;
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
    if(resImg === '' || resImg == null)
    {
      this.image = 'assets/images/prosumer-default-profileimage.png';
      this.changeImage = this.image;
    }
    else
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

  edit() {
    this.modalTitle = 'Edit Information';
    this.showEdit = true;
  }
  changePass() {
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
    // console.log(event);
    this.resetBoolean();
    if(event.target.files)
    {
      this.selectedImageFile = event.target.files[0];
      this.changeImage = this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.selectedImageFile)) as string;
      // this.base64= 'Base64...';
      // let reader = new FileReader();
      // reader.readAsDataURL(event.target.files[0]);
      // reader.onload = (e : any) =>{
      //   this.changeImage = e.target.result;
      // }
    }
  }
  confirmImage()
  {
    if(this.selectedImageFile != null && this.image != this.changeImage)
    {
      // let reader = new FileReader();
      // reader.readAsDataURL(this.selectedImageFile as Blob);
      // reader.onload = ()=>{
      //   this.base64 = reader.result as string;
      //   // this.base64 = this.base64.replace('','');
      //   console.log(this.base64);
        
      // }
      let sp = new SendPhoto(this.cookie.get('id'), this.selectedImageFile);
      console.log(sp);
      this.prosumerService.UploadImage(sp)
      .subscribe({
        next:(res)=>{
          this.success = true;
        },
        error:(err)=>{
          this.toast.error('Unable to update photo','Error!',{timeOut: 3000});
          console.log(err.error);
        }
      });
    }
    else
    {
      this.error = true;
    }
  }
  deleteImage()
  {
    this.prosumerService.DeleteImage()
    .subscribe({
      next:(res)=>{
        this.toast.success('Photo deleted.', 'Success!',{timeOut:2000});
        this.image = 'assets/images/prosumer-default-profileimage.png';
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
  }
  private resetBoolean()
  {
    this.success = false;
    this.error = false;
    this.updating = false;
  }
}
