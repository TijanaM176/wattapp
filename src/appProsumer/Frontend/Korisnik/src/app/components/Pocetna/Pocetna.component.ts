import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Pocetna',
  templateUrl: './Pocetna.component.html',
  styleUrls: ['./Pocetna.component.css']
})
export class PocetnaComponent implements OnInit {
loader:boolean=true;
  constructor() { }

  ngOnInit() {
    setTimeout(()=>{
      this.loader=false;
    },2000);
  }

}
