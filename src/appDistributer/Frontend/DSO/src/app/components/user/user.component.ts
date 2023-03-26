import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

    constructor(private user: UsersServiceService,private router:ActivatedRoute){

    }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


}
