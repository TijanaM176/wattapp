import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  region: string = '';
  regions : RegionComponent[] = [];
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
