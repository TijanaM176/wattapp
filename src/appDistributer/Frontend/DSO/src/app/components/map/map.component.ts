import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/services/map.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {
  
  map: any;
  users: any;

  constructor(private mapService : MapService, private toast: NgToastService) {}
  
  ngOnInit(): void {
    //this.getUsers();
  }
  
  ngAfterViewInit(): void {
    this.initMap();
    //this.populateTheMap();
  }

  private initMap(){
    this.map = L.map('map').setView([44.012794, 20.911423],13);
    const tiles = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      } as L.TileLayerOptions)

    tiles.addTo(this.map);
    const defaultIcon = L.icon({
      iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
      shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      shadowSize:   [50, 64], 
      iconAnchor:   [22, 94], 
      shadowAnchor: [4, 62],  
      popupAnchor:  [-3, -76]
    })
    this.map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
    .on('locationfound', (e:any) =>{
        var marker = L.marker([e.latitude, e.longitude],{icon: defaultIcon}).bindPopup('Your are here');
        marker.addTo(this.map)
    })
   .on('locationerror', (e:any) =>{
        console.log(e);
        this.toast.error({detail:"ERROR", summary: "Location access denied.", duration: 3000});
        //alert("Location access denied.");
    });
  }
  //drugi nacin
  /*options: L.MapOptions = {
    layers: this.getLayers(),
    zoom: 12,
    center: new L.LatLng(44.012794, 20.911423)
  };

  getLayers (): L.Layer[] {
    return [
      new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      } as L.TileLayerOptions),
    ] as L.Layer[];
  };*/

  populateTheMap()
  {
    for(var user of this.users)
    {
      var lon = user.longitude;
      var lat = user.latitude;
      var marker = L.marker([lon,lat]).addTo(this.map);
      marker.bindPopup("<b>Basic User Info</b>");
    }
  }

getUsers() {
  this.mapService.getUsers()
      .subscribe(
        {
          next:(res)=>{
            this.users=res;
          },
          error:(err)=>{
            //alert(err.error.message);
            this.toast.error({detail:"ERROR", summary: err.error,duration: 3000});
          }
        }
      )
  }
}

