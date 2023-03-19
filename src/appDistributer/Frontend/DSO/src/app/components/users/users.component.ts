import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import{Observable} from 'rxjs'
import { UsersServiceService } from 'src/app/services/users-service.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  searchName:string='';
  searchAddress:string='';
  prosumers!:Observable<any[]>;
  constructor(public service:UsersServiceService){}
  ngOnInit(): void {
    this.service.refreshList();
    console.log(this.service.prosumers);
  }

}
