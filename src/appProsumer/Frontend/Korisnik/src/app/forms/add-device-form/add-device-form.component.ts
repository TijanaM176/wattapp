import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { Category } from 'src/app/models/categories';
import { Models } from 'src/app/models/models';
import { DeviceType } from 'src/app/models/types';
import { AdddeviceserviceService } from 'src/app/services/adddeviceservice.service';

@Component({
  selector: 'app-add-device-form',
  templateUrl: './add-device-form.component.html',
  styleUrls: ['./add-device-form.component.css']
})
export class AddDeviceFormComponent {
  notFilled : boolean = false;
  success : boolean = false;
  failure : boolean = false;
  categories:Category[]=[];
  dropDownCategory: boolean = false;
  dropDownType:boolean=false;
  dropDownModel:boolean=false;
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
    this.dropDownType=false;
    this.dropDownModel=false;
    this.getCategories();
    
  }
  ChangeCategory(e:any){
    this.service.category=this.category;
    console.log(this.category);
    this.getTypes();
    this.getModels();
    this.Name="Device Name";
    
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
        this.dropDownType = true;
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
    this.Name=this.model.name;
    this.service.name=this.Name;
  
  }
  getModels(){
    this.service.getModels().subscribe({
      next:(response)=>{
        this.models = response;
        console.log(this.models);
        this.dropDownModel = true;
      },
      error:(err)=>
      {
        console.log(err.error);
      }
    })
  }
  ChangeName(e:any){
   
  this.service.name=this.Name;
  }
  
}
