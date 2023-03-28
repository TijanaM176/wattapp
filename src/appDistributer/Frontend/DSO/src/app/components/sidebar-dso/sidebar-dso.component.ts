import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-sidebar-dso',
  templateUrl: './sidebar-dso.component.html',
  styleUrls: ['./sidebar-dso.component.css']
})
export class SidebarDsoComponent implements OnInit{
    letValue: string="";
  constructor(private user: UsersServiceService,private router: ActivatedRoute,private cookie: CookieService)
  {

  }
  
  ngOnInit(): void {
    this.letValue=this.cookie.get("role");
    throw new Error('Method not implemented.');
  }
  DeleteUser()
  {
    console.log((this.router.snapshot.params['id']));
    this.user.deleteUser( this.router.snapshot.params['id']).
    subscribe((res)=>{ console.log(res);})
  }
}
