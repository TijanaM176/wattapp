import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  

  users: any;

  constructor(private router: Router, private cookie: CookieService, private auth: AuthServiceService, private toast: NgToastService) {
    
  }
  ngOnInit(): void {
    this.getAllUsers();
  }
  LogOut()
  {
    this.cookie.deleteAll();
    this.router.navigate(["login"]);
  }

  getAllUsers()
  {
    this.auth.getUsers()
      .subscribe(
        {
          next:(res)=>{
            //console.log(res);
            this.users=res;
          },
          error:(err)=>{
            //alert(err.error.message);
            this.toast.error({detail:"ERROR", summary: err.error,duration: 3000});
          }
        }
      )
  }
}
