import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-UserDevices',
  templateUrl: './UserDevices.component.html',
  styleUrls: ['./UserDevices.component.css'],
})
export class UserDevicesComponent implements OnInit {
  constructor() {}
  loader: boolean = true;
  ngOnInit() {
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }
}
