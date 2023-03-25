import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { UsersServiceService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnInit {
  map: any;
  users: any;
  markers!:any[];
  currentLocation: any;
  currentLocationIsSet = false;

  constructor(
    private mapService: UsersServiceService,
    private toast: NgToastService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.currentLocationIsSet = false;
    this.mapService.refreshList();
    this.users = this.mapService.prosumers;
    this.markers =[];
    //this.getUsers();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map',{minZoom: 8}).setView([44.012794, 20.911423], 15);
    const tiles = new L.TileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      } as L.TileLayerOptions
    );
    tiles.addTo(this.map);

    if (this.currentLocationIsSet) {
      this.map.removeLayer(this.currentLocation);
    }

    const defaultIcon = L.icon({
      iconUrl: 'assets/images/location.svg',
      iconSize: [30, 30],
      shadowSize: [50, 64],
      iconAnchor: [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor: [-8, -93],
    });

    if (!this.cookie.check('lat')) //ukoliko nemamo koordinate dso zaposlenog
    {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            this.cookie.set('lat', position.coords.latitude.toString());
            this.cookie.set('long', position.coords.longitude.toString());
            
            var acc = Number(position.coords.accuracy).toFixed(2);
            this.cookie.set('acc',acc);
            
            this.map.setView(
              [position.coords.latitude, position.coords.longitude],
              15
            );
            if (this.currentLocationIsSet) {
              this.map.removeLayer(this.currentLocation);
            }
            this.currentLocation = L.marker(
              [position.coords.latitude, position.coords.longitude],
              { icon: defaultIcon }
            ).bindPopup(
              'Your are here.<br>(within ' + acc + ' meters from this point)'
            );
            this.currentLocation.addTo(this.map);
            this.currentLocationIsSet = true;
          },
          (error) => {
            // If the user denies permission or an error occurs, handle it appropriately
            console.error("Error getting user's location:", error);
            this.toast.error({
              detail: 'ERROR',
              summary: 'Unable To Get Your Current Location.',
              duration: 3000,
            });
          },
          { enableHighAccuracy: true, timeout: 100 }
        );
      } 
      else {
        // If the browser does not support the Geolocation API, handle it appropriately
        this.toast.error({
          detail: 'ERROR',
          summary: 'Geolocation is not supported by this browser.',
          duration: 3000,
        });
      }
    }
    else
    {
      var lat = this.cookie.get('lat');
      var long = this.cookie.get('long');

      this.map.setView(
        [lat, long],
        15
      );

      if (this.currentLocationIsSet) {
        this.map.removeLayer(this.currentLocation);
      }

      this.currentLocation = L.marker(
        [Number(lat), Number(long)],
        { icon: defaultIcon }
      ).bindPopup(
        'Your are here.<br>(within ' + this.cookie.get('acc') + ' meters from this point)'
      );
      this.currentLocation.addTo(this.map);
      this.currentLocationIsSet = true;
    }

    const findMeControl = L.Control.extend({
      options: {
        position: 'topleft',
      },
      onAdd: () => {
        const button = L.DomUtil.create('button');
        button.innerHTML =
          '<span class="fa fa-crosshairs p-1 pt-2 pb-2"></span>';
        button.addEventListener('click', () => {
          this.map.setView(
            [Number(this.cookie.get('lat')), Number(this.cookie.get('long'))],
            16
          );
        });
        return button;
      },
    });
    this.map.addControl(new findMeControl());
    //this.populateTheMap();
  }

  populateTheMap() {
    for (var user of this.users) {
      var lon = user.longitude;
      var lat = user.latitude;
      var marker = L.marker([lon, lat]).addTo(this.map);
      marker.bindPopup('<b>Basic User Info</b>');
      this.markers.push(marker);
    }
  }

  deleteAllMarkers()
  {
    for (var marker of this.markers)
    {
      this.map.removeLayer(marker);
    }
  }
}
