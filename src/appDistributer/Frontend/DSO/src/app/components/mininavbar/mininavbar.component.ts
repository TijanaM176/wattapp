import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-mininavbar',
  templateUrl: './mininavbar.component.html',
  styleUrls: ['./mininavbar.component.css']
})
export class MininavbarComponent {

  currRoute : string = '';

  constructor(private router : ActivatedRoute) {}
}
