import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  items=[
    {Username:'mima',Address:'atinska',Consumption:10,Production:12,NumberOfDevices:7}
  ];
  constructor(){}

  ngOnInit(): void {
    this.items=[
      {Username:'mima',Address:'atinska',Consumption:10,Production:12,NumberOfDevices:7}
 
    ];
  }
  searchName:string='';
  searchAddress:string='';
  onSearchName(){
    if(this.searchName!=""){
    this.items=this.items.filter(res=>{
      return res.Username.toLocaleLowerCase().match(this.searchName.toLocaleLowerCase());
    });
  }
  else{
    this.ngOnInit();
  }
  
  }
  onSearchAddress(){
    if(this.searchAddress!=""){
      this.items=this.items.filter(res=>{
        return res.Address.toLocaleLowerCase().match(this.searchAddress.toLocaleLowerCase());
      });
    }
    else{
      this.ngOnInit();
    }
  }
}
