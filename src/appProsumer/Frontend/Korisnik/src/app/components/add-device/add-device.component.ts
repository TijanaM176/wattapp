import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AddDeviceFormComponent } from 'src/app/forms/add-device-form/add-device-form.component';
import { AddDevice } from 'src/app/models/adddevice';
import { Category } from 'src/app/models/categories';
import { Models } from 'src/app/models/models';
import { DeviceType } from 'src/app/models/types';
import { AdddeviceserviceService } from 'src/app/services/adddeviceservice.service';
import { DeviceCardsComponent } from '../deviceCards/deviceCards.component';
import { NavigationEnd  } from '@angular/router';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit{
  categories:Category[]=[];
  dropDownCategory: boolean = false;
  type!:number;
  currentRoute!: string;
  types:DeviceType[]=[];
  model!:Models;
  models:Models[]=[];
  Name:string='';
  manufacturer:string='';
  id:string='';
  success : boolean = false;
  failure : boolean = false;
  notFilled : boolean = false;
 show:boolean=false;
 @ViewChild('c', {static:false}) c! : AddDeviceFormComponent;

  constructor(private service:AdddeviceserviceService,private router:Router,private cookie:CookieService,public toast:NgToastService) { }
  ngOnInit(): void {
    //this.dropDownCategory = false;
    //this.getCategories();
    this.show=true;
    this.allToFalse();
  }

  close()
  {
    if(this.show){
      //location.reload();
      this.show=false;
      if(this.router.url==='/ProsumerApp/userDevices'){
        location.reload();
      }
      else{
        this.router.navigate(['/ProsumerApp/userDevices']);
      }
      
      
    }
    
  }
  registerDevice(){
    if(this.show){
    this.service.id=this.cookie.get('id');
    //this.service.name=this.Name;

    console.log(this.service.id);
    console.log(this.service.model);
    console.log(this.service.name);
    console.log(this.service.dsoView);
    console.log(this.service.dsoControl);
    let device : AddDevice = new AddDevice();
    device.modelId=this.service.model;
    device.name=this.service.name;
    device.dsoView=this.service.dsoView;
    device.dsoControl=this.service.dsoControl;
    this.service.RegisterDevice(device).subscribe({
      next:(response)=>{
        this.toast.success({detail:"Success!", summary:"New Device Added",duration:2500});
        this.success=true;
      },
      error:(err)=>
      {
        console.log(err.error);
        this.failure = true;
      }
    })
  }
  
}
private allToFalse()
{

  this.success = false;
  this.failure = false;
}
}
