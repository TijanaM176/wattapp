import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/services/map.service';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {
  
  map: any;
  users: any;
  currentLocation:any;
  currentLocationIsSet = false;

  constructor(private mapService : MapService, private toast: NgToastService, private cookie: CookieService) {}
  
  ngOnInit(): void {
    if(this.cookie.check('lat'))
    {
      this.cookie.delete('lat');
      this.cookie.delete('long');
    }
    this.currentLocationIsSet = false
    //this.getUsers();
  }
  
  ngAfterViewInit(): void {
    this.initMap();
    //this.populateTheMap();
  }

  private initMap(){
    this.map = L.map('map').setView([44.012794, 20.911423],15);
    const tiles = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      } as L.TileLayerOptions)

    tiles.addTo(this.map);
    const defaultIcon = L.icon({
      iconUrl: 'assets/images/location.svg',//'https://leafletjs.com/examples/custom-icons/leaf-green.png',
      //shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      iconSize: [30,30],
      shadowSize:   [50, 64], 
      iconAnchor:   [22, 94], 
      shadowAnchor: [4, 62],  
      popupAnchor:  [-8, -93]
    })

    this.map.locate({setView: true, watch: true, enableHighAccuracy: true, timeout: 50}) /* This will return map so you can do chaining */
    .on('locationfound', (e:any) =>{
        //console.log(e);
        if(this.currentLocationIsSet)
        {
          //console.log("izbrisana prethodna lokacija");
          this.map.removeLayer(this.currentLocation);
        }
        this.cookie.set('lat',e.latitude);
        this.cookie.set('long',e.longitude);
        var acc = Number(e.accuracy).toFixed(2);
        this.currentLocation = L.marker([e.latitude,e.longitude],{icon: defaultIcon}).bindPopup('Your are here.<br>(within '+acc+' meters from this point)');
        this.currentLocation.addTo(this.map);
        this.currentLocationIsSet=true;
    })
   .on('locationerror', (e:any) =>{
        console.log(e);
        this.toast.error({detail:"ERROR", summary: "Unable To Update Your Current Location.", duration: 3000});
        //alert("Location access denied.");
    });
    
    const findMeControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: () => {
        const button = L.DomUtil.create('button');
        button.innerHTML = '<span class="fa fa-crosshairs p-1"></span>';
        button.addEventListener('click', () => {
          this.map.setView([this.cookie.get('lat'), this.cookie.get('long')],15);
        });
        return button;
      }
    });
    this.map.addControl(new findMeControl());
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

