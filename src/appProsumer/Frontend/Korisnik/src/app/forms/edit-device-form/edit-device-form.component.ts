import { Component, Input } from '@angular/core';
import { Device } from 'src/app/models/device';
import { EditDevice } from 'src/app/models/deviceedit';
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
    this.Name=this.deviceData.Name;
  }
  editInfo()
  {
    //console.log(dto);
    if(this.IpAddress!="" && this.Name!="")
    {
      this.allToFalse();

      let device : EditDevice = new EditDevice();
      device.IpAddress = this.IpAddress;
      device.Name = this.Name;
      console.log(this.privremeniId);
      this.service.editInfo(this.privremeniId,device.Name,device.IpAddress)
      .subscribe({
        next:(res)=>{
          this.allToFalse();
          this.success = true;
        },
        error:(err)=>{
          this.allToFalse();
          console.log(err.error);
          this.failure = true;
        }
      })
    }
    else
    {
      this.allToFalse();
      this.notFilled = true;
    }
  }

  private allToFalse()
  {
    this.notFilled = false;
    this.success = false;
    this.failure = false;
  }
  
}
