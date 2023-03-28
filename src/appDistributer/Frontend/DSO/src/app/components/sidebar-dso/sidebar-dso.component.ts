import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-sidebar-dso',
  templateUrl: './sidebar-dso.component.html',
  styleUrls: ['./sidebar-dso.component.css']
})
export class SidebarDsoComponent implements OnInit{

  constructor(private user: UsersServiceService,private router: ActivatedRoute)
  {

  }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  DeleteUser()
  {
    console.log((this.router.snapshot.params['id']));
    this.user.deleteUser( this.router.snapshot.params['id']).
    subscribe((res)=>{ console.log(res);})
  }
}
