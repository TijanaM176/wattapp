import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  searchName:string='';
  searchAddress:string='';
  Items=[
    {Username:'mima',Address:'atinska',Consumption:10,Production:12,NumberOfDevices:7},
    {Username:'anamarija',Address:'karadjordjeva',Consumption:10,Production:12,NumberOfDevices:7},
    {Username:'ana',Address:'radoja domanovca',Consumption:10,Production:12,NumberOfDevices:7}
  ];
  constructor(){}

  ngOnInit(): void {
    this.Items=[
      {Username:'mima',Address:'atinska',Consumption:10,Production:12,NumberOfDevices:7},
      {Username:'anamarija',Address:'karadjordjeva',Consumption:10,Production:12,NumberOfDevices:7},
      {Username:'ana',Address:'radoja domanovca',Consumption:10,Production:12,NumberOfDevices:7}
 
    ];
  }

}
