import { Component, OnInit, ViewChild } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
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
  firstName : string = '';
  lastName : string = '';
  firstLastName : string = '';
  email : string = '';
  address : string = '';

  privremeniId:string = '6e2e9369-1386-4be4-8690-a4b7545ecbce';

  modalTitle : string ='';
  userData : any;
  showEdit : boolean = false;
  showChangePass : boolean = false;
  @ViewChild('editData', {static:false}) editData! : EditInfoFormComponent;

  constructor(private prosumerService : ProsumerService, private toast : NgToastService) {}

  ngOnInit(): void {
    this.getInformation();
  }

  private getInformation()
  {
    this.prosumerService.getInforamtion(this.privremeniId)
    .subscribe(
      {
        next:(res)=>{
          this.username = res.username;
          this.firstName = res.firstName;
          this.lastName =  res.lastName;
          this.firstLastName = res.firstName+' '+res.lastName;
          this.email = res.email;
          this.address = res.address;

          this.userData = res;
        },
        error:(err)=>{
          this.toast.error({detail:"Error!",summary:"Unable to load user data.", duration:3000});
          console.log(err.error);
        }
      }
    )
  }

  edit()
  {
    //console.log(this.userData);
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
    this.showEdit = false;
    this.showChangePass = false;
    this.modalTitle = ''
  }
  confirm()
  {
    if(this.showEdit)
    {
      this.editData.editInfo()
      this.showEdit = false;
    }
  }
}
