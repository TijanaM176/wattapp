import { Component, OnInit } from '@angular/core';
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

  privremeniId:string = '6e2e9369-1386-4be4-8690-a4b7545ecbce';

  constructor(private prosumerService : ProsumerService) {}

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
          this.firstLastName = res.firstName+' '+res.lastName;
          this.email = res.email;
          this.address = res.address;
        }
      }
    )
  }
}
