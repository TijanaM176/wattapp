import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-deviceinfo',
  templateUrl: './deviceinfo.component.html',
  styleUrls: ['./deviceinfo.component.css']
})
export class DeviceinfoComponent {
  color:ThemePalette='accent';
  disabled=false;
  checked=false;
}
