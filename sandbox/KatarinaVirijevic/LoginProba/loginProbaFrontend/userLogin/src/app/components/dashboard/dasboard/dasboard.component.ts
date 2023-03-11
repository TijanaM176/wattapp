import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.css']
})
export class DasboardComponent {

  /**
   *
   */
  constructor(private router: Router, private cookie: CookieService) {
    
  }
  LogOut()
  {
    this.cookie.delete("token");
    this.router.navigate(["login"]);
  }
}
