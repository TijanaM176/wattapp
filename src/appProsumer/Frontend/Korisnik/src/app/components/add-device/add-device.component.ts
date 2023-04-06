import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/categories';
import { Models } from 'src/app/models/models';
import { DeviceType } from 'src/app/models/types';
import { AdddeviceserviceService } from 'src/app/services/adddeviceservice.service';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit{
  categories:Category[]=[];
  dropDownCategory: boolean = false;
  category!:number;
  type!:number;
  types:DeviceType[]=[];
  model:Models=new Models();
  models:Models[]=[];
  Name:string='';
  manufacturer:string='';
  id:string='';
  constructor(private service:AdddeviceserviceService,private cookie:CookieService,public toast:NgToastService) { }
  ngOnInit(): void {
    this.dropDownCategory = false;
    this.getCategories();
    
  }
  ChangeCategory(e:any){
    this.service.category=this.category;
    console.log(this.category);
    this.getTypes();
  }
  getCategories(){
    this.service.getCategories().subscribe({
      next:(response)=>{
        this.categories = response;
        console.log(this.categories);
        this.dropDownCategory = true;
      },
      error:(err)=>
      {
        console.log(err.error);
      }
    })
  }
  ChangeType(e:any){
    this.service.type=this.type;
    console.log(this.type);
    this.getModels();
  }
  getTypes(){
    this.service.getTypes().subscribe({
      next:(response)=>{
        this.types = response;
        console.log(this.types);
        this.dropDownCategory = true;
      },
      error:(err)=>
      {
        console.log(err.error);
      }
    })
  }
  ChangeModels(e:any){
    console.log(this.model);
    this.service.model=this.model.id;
    this.Name=this.model.manufacturer;
    
  
  }
  getModels(){
    this.service.getModels().subscribe({
      next:(response)=>{
        this.models = response;
        console.log(this.models);
        this.dropDownCategory = true;
      },
      error:(err)=>
      {
        console.log(err.error);
      }
    })
  }
  registerDevice(){
    this.service.id=this.cookie.get('id');
    this.service.name=this.Name;

    console.log(this.service.id);
    console.log(this.service.model);
    console.log(this.service.name);
    this.service.RegisterDevice().subscribe({
      next:(response)=>{
        this.toast.success({detail:"Success!", summary:"New Device Added",duration:2500});
      },
      error:(err)=>
      {
        console.log(err.error);
      }
    })
  }
  
}
