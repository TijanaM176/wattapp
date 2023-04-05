import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { EditDeviceFormComponent } from 'src/app/forms/edit-device-form/edit-device-form.component';
import { Device } from 'src/app/models/device';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-deviceinfo',
  templateUrl: './deviceinfo.component.html',
  styleUrls: ['./deviceinfo.component.css']
})
export class DeviceinfoComponent {
  color:ThemePalette='accent';
  modalTitle : string ='';
  showEdit : boolean = false;
  IpAddress:string='';
  Manufacturer:string='';
  TypeName:string='';
  Name:string='';
  MaxUsage:string='';
  AvgUsage:string='';
  deviceData : any;
  disabled=false;
  checked=false;
  currentUsage!:number;
  idDev!:string;
  results: any;
  @ViewChild('editData', {static:false}) editData! : EditDeviceFormComponent;
  constructor( private router: ActivatedRoute, private service: DeviceserviceService,private toast : NgToastService){}
  /*infoForm = new FormGroup({
    IpAddress: new FormControl(''),
    TypeName: new FormControl(''),
    Manufacturer: new FormControl(''),
    Name: new FormControl(''),
    MaxUsage: new FormControl(''),
    AvgUsage: new FormControl(''),
  });
*/
  ngOnInit():void{
    
    this.getInformation();
  }
  getInformation(){
    this.idDev='6420b43190d65ae1554350a9';
    //this.idDev=this.router.snapshot.params['idDev'];
    this.service.getInfoDevice(this.idDev).subscribe(
      {
        next:(res)=>{
     
          this.IpAddress=res.IpAddress;
          this.TypeName=res.TypeName;
          this.Manufacturer=res.Manufacturer;
          this.Name=res.Name;
          this.MaxUsage=res.MaxUsage;
          this.AvgUsage=res.AvgUsage;
          this.currentUsage=res.CurrentUsage;
     

          this.deviceData = res;
        },
        error:(err)=>{
          this.toast.error({detail:"Error!",summary:"Unable to load user data.", duration:3000});
          console.log(err.error);
        }
      }
    )
  }
  delete(id:string){

  }
  edit(){

    this.modalTitle = "Edit Information";
    this.showEdit = true;
  
  }
  close()
  {
    if(this.showEdit)
    {
      this.getInformation();
      this.showEdit = false;
    }
    
    this.modalTitle = ''
  }
  confirm(){
    if(this.showEdit)
    {
      this.editData.editInfo()
      //this.showEdit = false;
    }
  }
}

