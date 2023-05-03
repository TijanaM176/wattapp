import { Component, HostListener } from '@angular/core';
import { DeviceWidthService } from './services/device-width.service';
import { Location } from '@angular/common';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ProsumerLogIn';

  constructor(private widthService: DeviceWidthService, private location: Location, private platformLocation: PlatformLocation) {
    this.widthService.deviceWidth = window.innerWidth;
    this.platformLocation.onPopState(() => {
      if (this.location.path() === '/login') {
        // If the user is on the login page, allow them to exit the app by pressing back button twice
        history.go(-1);
      } else if (this.location.path() === '/ProsumerApp/home') {
        // If the user is on the home page, remove the history entry for the home page
        history.go(-1);
        setTimeout(() => {
          history.pushState(null, '', this.location.path());
        });
      }
    });
  }
}
