import { Component, HostListener } from '@angular/core';
import { DeviceWidthService } from './services/device-width.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProsumerLogIn';

  constructor(private widthService : DeviceWidthService) {
    this.widthService.deviceWidth = window.innerWidth;
  }

  // @HostListener('window:resize',['$event'])
  // onResize(evet : any){
  //   this.widthService.deviceWidth = evet.target.innerWidth;
  // }
}
