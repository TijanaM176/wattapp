import { Component, Input } from '@angular/core';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-edit-device-form',
  templateUrl: './edit-device-form.component.html',
  styleUrls: ['./edit-device-form.component.css']
})
export class EditDeviceFormComponent {
  @Input() deviceData:any;

  IpAddress : string = '';
  TypeName : string = '';
  Manufacturer : string = '';
  Name:string='';
  notFilled : boolean = false;
  success : boolean = false;
  failure : boolean = false;

  privremeniId:string = '6420b43190d65ae1554350a9';

  constructor(private service : DeviceserviceService) {}

  ngOnInit(): void {
    this.loadInfo()
    
  }

  loadInfo()
  {
    this.IpAddress = this.deviceData.IpAddress;
    this.TypeName = this.deviceData.TypeName;
    this.Manufacturer = this.deviceData.Manufacturer;
    this.Name=this.deviceData.Name;
  }
  
}
