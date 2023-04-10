import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  DsoView!:boolean;
  DsoControl!:boolean;
  typeId!:number;
  idDev!:string;

  constructor(private service : DeviceserviceService,private router1:ActivatedRoute) {}

  ngOnInit(): void {
    this.loadInfo()
    
  }

  loadInfo()
  {
    this.IpAddress = this.deviceData.IpAddress;
    this.Name=this.deviceData.Name;
    this.Manufacturer=this.deviceData.Manufacturer;
    this.DsoControl=this.deviceData.DsoControl;
    this.DsoView=this.deviceData.DsoView;
  }
  editInfo()
  {
    //console.log(dto);
    if(this.IpAddress!="" && this.Name!="")
    {
      this.allToFalse();
      this.idDev= this.router1.snapshot.params['idDev'];
      let device : EditDevice = new EditDevice();
      device.IpAddress = this.IpAddress;
      device.Name = this.Name;
      device.Manufacturer=this.Manufacturer;
      device.DsoView=this.DsoView;
      device.DsoControl=this.DsoControl;
      console.log(this.idDev);
      console.log(this.Name);
      console.log(this.Manufacturer);
      console.log(this.DsoView);
      console.log(this.DsoControl);
      this.service.editInfo(this.idDev,device)
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
