import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-mininavbar',
  templateUrl: './mininavbar.component.html',
  styleUrls: ['./mininavbar.component.css']
})
export class MininavbarComponent implements OnInit, AfterViewInit {

  currRoute : string = '';

  constructor(private router : ActivatedRoute) {}


  ngAfterViewInit(): void {
    if(this.currRoute == 'users')
    {
      document.getElementById('mininavbarProsumersTable')!.style.backgroundColor = 'white';
      document.getElementById('mininavbarProsumersMap')!.style.backgroundColor = '#ddd'
    }
    else if(this.currRoute == 'map')
    {
      document.getElementById('mininavbarProsumersMap')!.style.backgroundColor = 'white'
      document.getElementById('mininavbarProsumersTable')!.style.backgroundColor = '#ddd';
    }
  }


  ngOnInit(): void {
    this.currRoute = this.router.snapshot.url.join('/');
    // console.log(this.currRoute);
    this.changeColor();
  }

  changeColor()
  {
    if(this.currRoute == 'users')
    {
      document.getElementById('mininavbarProsumersTable')!.style.backgroundColor = 'white';
      document.getElementById('mininavbarProsumersMap')!.style.backgroundColor = '#ddd'
    }
    else if(this.currRoute == 'map')
    {
      document.getElementById('mininavbarProsumersMap')!.style.backgroundColor = 'white'
      document.getElementById('mininavbarProsumersTable')!.style.backgroundColor = '#ddd';
    }
  }

}
