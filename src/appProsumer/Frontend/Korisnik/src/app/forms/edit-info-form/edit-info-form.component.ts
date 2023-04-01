import { Component, Input, OnInit } from '@angular/core';
import { EditDto } from 'src/app/models/editDto';
import { EditableInfo } from 'src/app/models/editableInfo';
import { ProsumerService } from 'src/app/services/prosumer.service';

@Component({
  selector: 'app-edit-info-form',
  templateUrl: './edit-info-form.component.html',
  styleUrls: ['./edit-info-form.component.css']
})
export class EditInfoFormComponent implements OnInit{

  @Input() userData:any;

  firstName : string = '';
  lastName : string = '';
  email : string = '';

  constructor(private userService : ProsumerService) {}

  ngOnInit(): void {
    this.loadInfo()
    // console.log(this.userData);
  }

  editInfo()
  {
    let dto : EditDto = new EditDto();
    dto.firstName = this.firstName;
    dto.lastName = this.lastName;
    dto.email = this.email;
  }

  loadInfo()
  {
    this.firstName = this.userData.firstName;
    this.lastName = this.userData.lastName;
    this.email = this.userData.email;
  }
}
