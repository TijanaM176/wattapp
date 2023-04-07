import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Neighborhood } from 'src/app/models/neighborhood';
import { Options, LabelType } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnInit {
  minValueP: number = 0;
  maxValueP: number = 300;
  optionsP: Options = {
    floor: 0,
    ceil: 300,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + 'W';
        case LabelType.High:
          return value + 'W';
        default:
          return '' + value;
      }
    },
  };
  minValueC: number = 0;
  maxValueC: number = 300;
  optionsC: Options = {
    floor: 0,
    ceil: 300,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + 'W';
        case LabelType.High:
          return value + 'W';
        default:
          return '' + value;
      }
    },
  };
  minValue: number = 0;
  maxValue: number = 50;
  options: Options = {
    floor: 0,
    ceil: 50,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '';
        case LabelType.High:
          return value + '';
        default:
          return '' + value;
      }
    },
  };
  neighborhood: string = '';
  Neighborhoods: Neighborhood[] = [];
  dropDownNeigh: string = '';
  map: any = null;
  users!: any[];
  markers!: any[];
  currentLocation: any;
  currentLocationIsSet = false;
  constructor(
    private mapService: UsersServiceService,
    private toast: NgToastService,
    private cookie: CookieService
  ) {}
  ChangeNeighborhood(e: any) {
    this.dropDownNeigh = e.target.value;
  }

  ngOnInit(): void {
    this.mapService.getAllNeighborhoods().subscribe((response) => {
      this.Neighborhoods = response;
    });
    this.currentLocationIsSet = false;
    this.mapService.refreshList();
    this.markers = [];
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map', { minZoom: 8 }).setView([44.012794, 20.911423], 15);
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

    if (!this.cookie.check('lat')) {
      //ukoliko nemamo koordinate dso zaposlenog
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.cookie.set('lat', position.coords.latitude.toString(), {
              path: '/',
            });
            this.cookie.set('long', position.coords.longitude.toString(), {
              path: '/',
            });

            var acc = Number(position.coords.accuracy).toFixed(2);
            this.cookie.set('acc', acc, { path: '/' });

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
          }
        );
      } else {
        // If the browser does not support the Geolocation API, handle it appropriately
        this.toast.error({
          detail: 'ERROR',
          summary: 'Geolocation is not supported by this browser.',
          duration: 3000,
        });
      }
    } else {
      var lat = this.cookie.get('lat');
      var long = this.cookie.get('long');

      this.map.setView([lat, long], 15);

      if (this.currentLocationIsSet) {
        this.map.removeLayer(this.currentLocation);
      }

      this.currentLocation = L.marker([Number(lat), Number(long)], {
        icon: defaultIcon,
      }).bindPopup(
        'Your are here.<br>(within ' +
          this.cookie.get('acc') +
          ' meters from this point)'
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

    while (this.map == null);
    this.populateTheMap(this.map);
  }

  funkcija() {
    this.mapService
      .ProsumersInfo1()
      .subscribe((response) => console.log(response));
  }

  populateTheMap(map: any) {
    this.mapService.ProsumersInfo1().subscribe({
      next: (res) => {
        // this.funkcija();
        console.log(res);
        this.users = res;
        //console.log(this.users)
        const prosumerIcon = L.icon({
          iconUrl: 'assets/images/location-prosumer.svg',
          iconSize: [65, 65],
          shadowSize: [50, 64],
          iconAnchor: [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor: [11, -77],
        });
        for (let user of this.users) {
          let lon = user.long;
          let lat = user.lat;
          if (lon != null && lat != null) {
            let marker = L.marker(
              [Number(lat.toString()), Number(lon.toString())],
              { icon: prosumerIcon }
            ).addTo(map);
            this.mapService.getUserProductionAndConsumption(user.id).subscribe({
              next: (res) => {
                marker.bindPopup(
                  '<h5><b>' +
                    user.username +
                    '</b></h5><h6><b>' +
                    user.address +
                    '</b></h6>Current consumption: <b>' +
                    res.consumption.toString() +
                    ' kw</b> <br> Current production: <b>' +
                    res.production.toString() +
                    ' kw</b>' +
                    "<br><br><a href='/DsoApp/user/" +
                    user.id +
                    "'>View More</a>"
                );
              },
              error: (err) => {
                marker.bindPopup(
                  '<h5><b>' +
                    user.username +
                    '</b></h5><h6><b>' +
                    user.address +
                    '</b></h6>Current consumption: <b>? kw</b> <br> Current production: <b>? kw</b>' +
                    "<br><br><a href='/DsoApp/user/" +
                    user.id +
                    "'>View More</a>"
                ); //"/user/{{item.id}}"

                console.log(err.error);
              },
            });
            this.markers.push(marker);
          }
        }
      },
      error: (err) => {
        this.toast.error({
          detail: 'Error',
          summary: 'Unable to retreive prosumer locations',
          duration: 3000,
        });
        console.log(err.error);
      },
    });
  }

  populateTheMap2(map: any) {
    const prosumerIcon = L.icon({
      iconUrl: 'assets/images/location-prosumer.svg',
      iconSize: [65, 65],
      shadowSize: [50, 64],
      iconAnchor: [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor: [11, -77],
    });
    for (let user of this.users) {
      let lon = user.long;
      let lat = user.lat;
      if (lon != null && lat != null) {
        let marker = L.marker(
          [Number(lat.toString()), Number(lon.toString())],
          { icon: prosumerIcon }
        ).addTo(map);
        this.mapService.getUserProductionAndConsumption(user.id).subscribe({
          next: (res) => {
            marker.bindPopup(
              '<h5><b>' +
                user.username +
                '</b></h5><h6><b>' +
                user.address +
                '</b></h6>Current consumption: <b>' +
                res.consumption.toString() +
                ' kw</b> <br> Current production: <b>' +
                res.production.toString() +
                ' kw</b>' +
                "<br><br><a href='/DsoApp/user/" +
                user.id +
                "'>View More</a>"
            );
          },
          error: (err) => {
            marker.bindPopup(
              '<h5><b>' +
                user.username +
                '</b></h5><h6><b>' +
                user.address +
                '</b></h6>Current consumption: <b>? kw</b> <br> Current production: <b>? kw</b>' +
                "<br><br><a href='/DsoApp/user/" +
                user.id +
                "'>View More</a>"
            ); //"/user/{{item.id}}"

            console.log(err.error);
          },
        });
        this.markers.push(marker);
      }
    }
  }

  deleteAllMarkers() {
    for (var marker of this.markers) {
      this.map.removeLayer(marker);
    }
  }

  filterwithoutNeighborhood() {
    this.mapService
      .prosumerFilter(
        this.minValueC,
        this.maxValueC,
        this.minValueP,
        this.maxValueP,
        this.minValue,
        this.maxValue
      )
      .subscribe((response) => {
        this.users = response;
      });
    this.deleteAllMarkers();
    this.populateTheMap2(this.map);
  }
  filterwithNeighborhood() {
    this.mapService
      .prosumerFilter2(
        this.dropDownNeigh,
        this.minValueC,
        this.maxValueC,
        this.minValueP,
        this.maxValueP,
        this.minValue,
        this.maxValue
      )
      .subscribe((response) => {
        this.users = response;
      });
    this.deleteAllMarkers();
    this.populateTheMap2(this.map);
  }

  filter() {
    if (this.dropDownNeigh === 'b' || this.dropDownNeigh === '') {
      this.filterwithoutNeighborhood();
    } else {
      this.filterwithNeighborhood();
    }
  }

  reset() {
    this.minValueC = 0;
    this.maxValueC = 300;
    this.minValueP = 0;
    this.maxValueP = 300;
    this.minValue = 0;
    this.maxValue = 50;
    this.mapService.getAllNeighborhoods().subscribe((response) => {
      this.users = response;
      console.log(response);
    });
    this.deleteAllMarkers();

    this.populateTheMap(this.map);
  }
}
