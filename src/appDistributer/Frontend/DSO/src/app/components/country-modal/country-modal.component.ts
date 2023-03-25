import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.css']
})
export class CountryModalComponent {

  currentCountry: any;
  showModal = false

  constructor(private cookie: CookieService) {}

  SaveCountry()
  {
    if(this.currentCountry!="")
    {
      this.cookie.set('country',this.currentCountry);
      this.Close();
    }
  }

  Open()
  {
    this.showModal = true;
  }
  Close()
  {
    this.showModal = false;
  }
}
