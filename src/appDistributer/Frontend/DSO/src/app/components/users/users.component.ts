import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  searchName: string = '';
  searchAddress: string = '';
  prosumer!: any;
  total!:number;
  perPage:number=10;
  prosumers!:any;
  pagenum!:number;
  page:number=1;
  tableSizes:any=[10,15,20];
  constructor(public service: UsersServiceService,private router:Router) {}
  ngOnInit(): void {
    this.service.refreshList();
  }
  Details(id: string) {
    this.service.detailsEmployee(id).subscribe(res => {
      this.prosumer = res;
     
        console.log(this.prosumer);
        this.router.navigate(['/user'],{queryParams:{id:this.prosumer.id} });
        console.log(id);
      
    });
  }

  Paging(){
    this.service.Page(this.page,this.perPage).subscribe((res)=>{
      this.prosumers=res;
      console.log(this.service.prosumers);
    });
  }
  onTableDataChange(event:any){
    this.page=event;
    console.log(this.page);
    this.Paging();
    
  }/*
  onTableSizeChange(event:any):void
{
  this.perPage=event.target.value;
  this.page=1;
  this.Paging();
}  */
}
