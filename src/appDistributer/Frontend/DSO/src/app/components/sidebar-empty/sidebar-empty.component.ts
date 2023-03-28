import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-empty',
  templateUrl: './sidebar-empty.component.html',
  styleUrls: ['./sidebar-empty.component.css']
})
export class SidebarEmptyComponent implements OnInit{

  currentUrl!:string;

  constructor(private router : Router) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    //console.log(this.currentUrl);
  }

}
