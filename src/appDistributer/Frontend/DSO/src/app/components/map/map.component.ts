import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent { // implements AfterViewInit
  
  //private map: any;

  /*constructor() {}
  
  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(){
    this.map = L.map('map').setView([44.618680,20.268950],15);

  }

  options: L.MapOptions = {
    layers: this.getLayers(),
    zoom: 12,
    center: new L.LatLng(44.618680, 20.268950)
  };

  getLayers (): L.Layer[] {
    return [
      new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      } as L.TileLayerOptions),
    ] as L.Layer[];
  };*/
}

