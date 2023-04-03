import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarDsoComponent } from '../sidebar-dso/sidebar-dso.component';
import { data } from 'jquery';

@Component({
  selector: 'app-user1',
  templateUrl: './user1.component.html',
  styleUrls: ['./user1.component.css']
})
export class User1Component {
  @ViewChild('sidebarInfo', { static: true }) sidebarInfo!: SidebarDsoComponent;
  constructor(
      private user: UsersServiceService,
      private router: ActivatedRoute )
   
      {
    
  
      }
 
 
  myData:any;
  

  ngOnInit(): void {
    this.user.detailsEmployee(this.router.snapshot.params['id']).subscribe
    ((data) => {
      this.myData=data;
    })
 
}
 }

