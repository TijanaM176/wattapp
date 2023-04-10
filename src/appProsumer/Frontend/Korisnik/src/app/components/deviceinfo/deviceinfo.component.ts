import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  DsoView!:boolean;
  DsoControl!:boolean;
  results: any;
  @ViewChild('editData', {static:false}) editData! : EditDeviceFormComponent;
  constructor( private router: Router, private service: DeviceserviceService,private toast : NgToastService,private router1: ActivatedRoute){}
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
  isActive(){
    
  }
  getInformation(){
    
    this.idDev= this.router1.snapshot.params['idDev'];
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
          this.DsoView=res.DsoView;
          this.DsoControl=res.DsoControl;

          this.deviceData = res;
        },
        error:(err)=>{
          this.toast.error({detail:"Error!",summary:"Unable to load device data.", duration:3000});
          console.log(err.error);
        }
      }
    )
  }
  delete(id:string){
    if (confirm('Do you want to delete ?')) {
      
    this.service.deleteDevice(this.idDev).subscribe(
      {
        next:(res)=>{
          this.router.navigate(['ProsumerApp/home']);
          console.log("deleted");
          
        },
        error:(err)=>{
          this.toast.error({detail:"Error!",summary:"Unable to delete device data.", duration:3000});
          console.log(err.error);
        }
      }
    
    )
    }

    
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

