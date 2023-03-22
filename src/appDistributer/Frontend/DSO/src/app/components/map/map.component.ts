import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/services/map.service';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnInit {
  map: any;
  users: any;
  currentLocation: any;
  currentLocationIsSet = false;

  constructor(
    private mapService: MapService,
    private toast: NgToastService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.currentLocationIsSet = false;
    //this.getUsers();
  }

  ngAfterViewInit(): void {
    this.initMap();
    //this.populateTheMap();
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
    
    //lociranje dso zaposlenog - prati se njegovo kretanje (mozda moze i da se izbrise)
    /*this.map
      .locate({
        setView: true,
        watch: true, //moze da se zakomentarise ukoliko ne zelimo da pratimo pomeranje korisnika
        enableHighAccuracy: true,
        timeout: 60,
      }) // This will return map so you can do chaining
      .on('locationfound', (e: any) => {
        console.log(e);
        if (this.currentLocationIsSet) {
          this.map.removeLayer(this.currentLocation);
        }
        this.cookie.set('lat', e.latitude);
        this.cookie.set('long', e.longitude);
        var acc = Number(e.accuracy).toFixed(2);
        this.map.setView(
          [Number(this.cookie.get('lat')), Number(this.cookie.get('long'))],
          15
        );
        this.currentLocation = L.marker([e.latitude, e.longitude], {
          icon: defaultIcon,
        }).bindPopup(
          'Your are here.<br>(within ' + acc + ' meters from this point)'
        );
        this.currentLocation.addTo(this.map);
        this.currentLocationIsSet = true;
      })
      .on('locationerror', (e: any) => {
        console.log(e);
        this.toast.error({
          detail: 'ERROR',
          summary: 'Unable To Update Your Current Location.',
          duration: 3000,
        });
      });*/

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
//--------------------------------------------------Uzimanje koordinata iz adrese------------------------------------------------------------------
   /* var address = 'Atinska 18,Kragujevac,Serbia';
    var key='Ag6ud46b-3wa0h7jHMiUPgiylN_ZXKQtL6OWJpl6eVTUR5CnuwbUF7BYjwSA4nZ_';
    var url = 'https://dev.virtualearth.net/REST/v1/Locations?query=' + encodeURIComponent(address)+ '&key=' + key;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      // Extract the latitude and longitude from the response
      const location = data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
      const latitude = location[0];
      const longitude = location[1];

        // create a marker at the location
        var markerUser = L.marker([latitude, longitude],{ icon: defaultIcon });

        // center the map on the marker
        markerUser.addTo(this.map);
      })
      .catch(error => {
        this.toast.error({
          detail: 'ERROR',
          summary: 'Error fetching location data.',
          duration: 3000,
        });
        console.error(`Error fetching location data: ${error}`);
      });*/
//-------------------------------------------------------------------------------------------------------------------------------------------------
  }

  populateTheMap() {
    for (var user of this.users) {
      var lon = user.longitude;
      var lat = user.latitude;
      var marker = L.marker([lon, lat]).addTo(this.map);
      marker.bindPopup('<b>Basic User Info</b>');
    }
  }

  getUsers() {
    this.mapService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        //alert(err.error.message);
        this.toast.error({
          detail: 'ERROR',
          summary: err.error,
          duration: 3000,
        });
      },
    });
  }
}
