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
    this.map = L.map('map').setView([44.012794, 20.911423],12);
    const tiles = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      } as L.TileLayerOptions)
    tiles.addTo(this.map);

    if(this.currentLocationIsSet)
    {
      
      this.map.removeLayer(this.currentLocation);
    }

    const defaultIcon = L.icon({
      iconUrl: 'assets/images/location.svg',//'https://leafletjs.com/examples/custom-icons/leaf-green.png',
      //shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      iconSize: [30,30],
      shadowSize:   [50, 64], 
      iconAnchor:   [22, 94], 
      shadowAnchor: [4, 62],  
      popupAnchor:  [-8, -93]
    })

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.cookie.set('lat',position.coords.latitude.toString());
        this.cookie.set('long',position.coords.longitude.toString());
        this.map.setView([position.coords.latitude, position.coords.longitude], 12);
        if(this.currentLocationIsSet)
        {
          this.map.removeLayer(this.currentLocation);
        }
        var acc = Number(position.coords.accuracy).toFixed(2);
        this.currentLocation = L.marker([position.coords.latitude,position.coords.longitude],{icon: defaultIcon}).bindPopup('Your are here.<br>(within '+acc+' meters from this point)');
        this.currentLocation.addTo(this.map);
        this.currentLocationIsSet=true;
      }, 
      (error) => {
        // If the user denies permission or an error occurs, handle it appropriately
        console.error("Error getting user's location:", error);
        this.toast.error({detail:"ERROR", summary: "Unable To Get Your Current Location.", duration: 3000});
      },{ enableHighAccuracy: true, timeout:100 });
    } 
    else {
      // If the browser does not support the Geolocation API, handle it appropriately
      this.toast.error({detail:"ERROR", summary: "Geolocation is not supported by this browser.", duration: 3000});
    }

    this.map.locate({setView: true, watch: true, enableHighAccuracy: true, timeout: 60}) // This will return map so you can do chaining 
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
        this.map.setView([Number(this.cookie.get('lat')), Number(this.cookie.get('long'))],12);
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
        button.innerHTML = '<span class="fa fa-crosshairs p-1 pt-2 pb-2"></span>';
        button.addEventListener('click', () => {
          this.map.setView([Number(this.cookie.get('lat')), Number(this.cookie.get('long'))],16);
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

