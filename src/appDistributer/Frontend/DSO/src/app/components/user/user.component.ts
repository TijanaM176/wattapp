import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { FormGroup,FormControl } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

    constructor(private user: UsersServiceService,private router: ActivatedRoute){

    }
    editUser=new FormGroup( {
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      username: new FormControl(''),
     email: new FormControl(''),
     address: new FormControl(''),
     neigborhoodId: new FormControl(''),
      
    }

    );
    message: boolean=false;


  ngOnInit(): void {
    //console.log(this.router.snapshot.params['id'] );
    this.user.detailsEmployee( this.router.snapshot.params['id']).subscribe((res:any)=> { 
      console.log(res);
    this.editUser=new FormGroup( {
      firstname: new FormControl( res ['firstName']),
      lastname: new FormControl( res ['lastName']),
      username: new FormControl(res ['username']),
     email: new FormControl(res ['email']),
     address: new FormControl(res ['address']),
     neigborhoodId: new FormControl(res['neigborhoodId']),
    });
  });

  }
  UpdateData()
  {
      
      this.user.updateUserData( this.router.snapshot.params['id'],this.editUser.value).
      subscribe((res)=>{ console.log(res);})
  }



}
