import { Component, OnInit, ViewChild } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { ChangePasswordComponent } from 'src/app/forms/change-password/change-password.component';
import { EditInfoFormComponent } from 'src/app/forms/edit-info-form/edit-info-form.component';
import { EditableInfo } from 'src/app/models/editableInfo';
import { ProsumerService } from 'src/app/services/prosumer.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  username : string = '';
  firstLastName : string = '';
  email : string = '';
  address : string = '';
  city:string='';
  neighborhood:string='';
  loader:boolean=true;
  modalTitle : string ='';
  userData : any;
  showEdit : boolean = false;
  showChangePass : boolean = false;

  @ViewChild('editData', {static:false}) editData! : EditInfoFormComponent;
  @ViewChild('changePassword',{static:false}) changePassword! : ChangePasswordComponent;

  constructor(private prosumerService : ProsumerService, private toast : NgToastService, private cookie : CookieService) {}

  ngOnInit(): void {
    this.getInformation();
    setTimeout(()=>{
      this.loader=false;
    },2000);
  }

  private getInformation()
  {
    this.prosumerService.getInforamtion(this.cookie.get('id'))
    .subscribe(
      {
        next:(res)=>{

          this.username = res.username;
          this.firstLastName = res.firstName+' '+res.lastName;
          this.email = res.email;
          this.address = res.address;
          this.prosumerService.cityId=res.cityId;
          this.prosumerService.neighId=res.neigborhoodId;
          this.City();
          this.Neighborhood();
          this.userData = res;
        },
        error:(err)=>{
          this.toast.error({detail:"Error!",summary:"Unable to load user data.", duration:3000});
          console.log(err.error);
        }
      }
    )

  }
  City(){
    this.prosumerService.getCityById().subscribe({
      next:(res)=>{
        this.city=res;
      },
      error:(err)=>{
        this.toast.error({detail:"Error!",summary:"Unable to load user data.", duration:3000});
        console.log(err.error);
      }
    })
  }
Neighborhood(){
  this.prosumerService.getNeighborhoodById().subscribe({
    next:(res)=>{
      this.neighborhood=res;
    },
    error:(err)=>{
      this.toast.error({detail:"Error!",summary:"Unable to load user data.", duration:3000});
      console.log(err.error);
    }
  })
}

  edit()
  {
    this.modalTitle = "Edit Information";
    this.showEdit = true;
  }
  changePass()
  {
    this.modalTitle = "Change Password";
    this.showChangePass = true;
  }

  close()
  {
    if(this.showEdit)
    {
      this.loader=true;
      this.showEdit = false;
      this.getInformation();
      setTimeout(()=>{
        this.loader=false;
      },2000);
      
    }
    if(this.showChangePass)
    {
      this.showChangePass = false;
    }
    this.modalTitle = ''
  }
  confirm()
  {
    if(this.showEdit)
    {
      this.editData.editInfo()
    }
    if(this.showChangePass)
    {
      this.changePassword.changePass();
    }
  }
}
