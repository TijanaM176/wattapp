import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
// import { NgToastService } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Neighborhood } from 'src/app/models/neighborhood';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { ScreenWidthService } from 'src/app/services/screen-width.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnInit {
  loader: boolean = true;
  map: any;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

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
  neighborhood: string = 'b';
  Neighborhoods: Neighborhood[] = [];
  dropDownNeigh: string = 'b';

  users!: any[];
  markers!: any[];
  currentLocation: any;
  currentLocationIsSet = false;
  currentHour: any;

  constructor(
    private mapService: UsersServiceService,
    private widthService: ScreenWidthService,
    public toast:ToastrService,
    private cookie: CookieService,
    private deviceServer:DeviceserviceService
  ) {}

  ChangeNeighborhood(e: any) {
    this.dropDownNeigh = e.target.value;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loader = false;
    }, 3000);
    let t = window.innerWidth < 320? 140.6 : 101;
    let h = window.innerHeight - t;

    document.getElementById('sadrzaj')!.style.height = h + 'px';
    document.getElementById('mapCont')!.style.height = h + 'px';
    document.getElementById('side')!.style.height = h + 'px';

    this.mapService.getAllNeighborhoods().subscribe((response) => {
      this.Neighborhoods = response;
    });
    this.currentLocationIsSet = false;
    this.mapService.refreshList();
    this.markers = [];
    this.currentHour = new Date().getHours();

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      let t = window.innerWidth < 320? 140.6 : 101;
      let h = window.innerHeight - t;
      document.getElementById('sadrzaj')!.style.height = h + 'px';
      document.getElementById('mapCont')!.style.height = h + 'px';
      document.getElementById('side')!.style.height = h + 'px';
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap() {
    let t = window.innerWidth < 320? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('sadrzaj')!.style.height = h + 'px';
    document.getElementById('mapCont')!.style.height = h + 'px';
    document.getElementById('side')!.style.height = h + 'px';

    let map = L.map('map', { minZoom: 8 }); //.setView([44.012794, 20.911423], 15);

    var lat = this.cookie.get('lat');
    var long = this.cookie.get('long');
    map.setView([Number(lat), Number(long)], 12);

    const tiles = new L.TileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      } as L.TileLayerOptions
    );
    tiles.addTo(map);
    const icon = L.icon({
      iconUrl: 'assets/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
    });

    let marker = L.marker([Number(lat), Number(long)], { icon: icon }).addTo(
      map
    );
    marker.bindPopup(
      '<h6>Center of region ' + this.cookie.get('region') + '</h6>'
    );

    const findMeControl = L.Control.extend({
      options: {
        position: 'topleft',
      },
      onAdd: () => {
        const button = L.DomUtil.create('button');
        button.innerHTML =
          '<span class="fa fa-crosshairs p-1 pt-2 pb-2"></span>';
        button.addEventListener('click', () => {
          map.setView(
            [Number(this.cookie.get('lat')), Number(this.cookie.get('long'))],
            12
          );
        });
        return button;
      },
    });
    map.addControl(new findMeControl());
    this.map = map;
    this.populateTheMap(this.map);
  }

  populateTheMap(map: any) {
    this.deviceServer.ProsumersInfo1().subscribe({
      next: (res) => {
        this.users = res;
        let iconUrl = 'assets/images/marker-icon-2x-blueviolet.png';

        for (let user of this.users) {
          let lon = user.long;
          let lat = user.lat;
          if (lon != null && lat != null) {
            iconUrl = this.decideOnMarker(user.consumption, user.production);
            const prosumerIcon = L.icon({
              iconUrl: iconUrl,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
            });
            let marker = L.marker(
              [Number(lat.toString()), Number(lon.toString())],
              { icon: prosumerIcon }
            ).addTo(map);
            marker.bindPopup(
              '<h5><b>' +
                user.username +
                '</b></h5><h6><b>' +
                user.address +
                '</b></h6>Current consumption: <b>' +
                Number(user.consumption).toFixed(3) +
                ' kW</b> <br> Current production: <b>' +
                Number(user.production).toFixed(3) +
                ' kW</b> <br> Num. of devices: <b>' +
                user.devCount.toString() +
                "</b> <br><br><a href='/DsoApp/user/" +
                user.id +
                "'>View More</a>"
            );
            this.markers.push(marker);
          }
        }
      },
      error: (err) => {

        this.toast.error('Error!', 'Unable to retreive prosumer locations.', {
          timeOut: 2500,
        });
        console.log(err.error);
      },
    });
  }

  populateTheMap2(map: any) {
    let iconUrl = 'assets/images/marker-icon-2x-blueviolet.png';
    for (let user of this.users) {
      let lon = user.long;
      let lat = user.lat;
      if (lon != null && lat != null) {
        iconUrl = this.decideOnMarker(user.consumption, user.production);
        const prosumerIcon = L.icon({
          iconUrl: iconUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
        });
        let marker = L.marker(
          [Number(lat.toString()), Number(lon.toString())],
          { icon: prosumerIcon }
        ).addTo(map);
        marker.bindPopup(
          '<h5><b>' +
            user.username +
            '</b></h5><h6><b>' +
            user.address +
            '</b></h6>Current consumption: <b>' +
            Number(user.consumption).toFixed(3) +
            ' kW</b> <br> Current production: <b>' +
            Number(user.production).toFixed(3) +
            ' kW</b> <br> Num. of devices: <b>' +
            user.devCount.toString() +
            "</b> <br><br><a href='/DsoApp/user/" +
            user.id +
            "'>View More</a>"
        );
        this.markers.push(marker);
      }
    }
  }

  deleteAllMarkers(map: any) {
    for (var marker of this.markers) {
      map.removeLayer(marker);
    }
    this.markers = [];
  }

  filterwithoutNeighborhood(map: any) {
    this.deleteAllMarkers(map);
    this.deviceServer
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
        //console.log(response);
        this.populateTheMap2(map);
      });
  }
  filterwithNeighborhood(map: any) {
    this.deleteAllMarkers(map);
    this.deviceServer
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
        this.populateTheMap2(map);
      });
  }

  filter() {
    if (this.dropDownNeigh === 'b' || this.dropDownNeigh === '') {
      this.filterwithoutNeighborhood(this.map);
    } else {
      this.filterwithNeighborhood(this.map);
    }
  }

  reset() {
    this.deleteAllMarkers(this.map);
    this.mapService.getAllNeighborhoods().subscribe((response) => {
      this.users = response;
      //console.log(response);
      this.populateTheMap(this.map);
    });
    this.minValueC = 0;
    this.maxValueC = 300;
    this.minValueP = 0;
    this.maxValueP = 300;
    this.minValue = 0;
    this.maxValue = 50;
    this.dropDownNeigh = 'b';
  }

  private decideOnMarker(consumptionUser: any, productionUSer: any): string {
    let prag = 0.0001;
    let conumption = Number(consumptionUser);
    let production = Number(productionUSer);
    let razlika = conumption - production;
    let iconUrl = 'assets/images/marker-icon-2x-blueviolet.png';
    if (razlika > prag) {
      iconUrl = 'assets/images/marker-icon-2x-orange.png';
      if (conumption <= 0.4) {
        iconUrl = 'assets/images/marker-icon-2x-yellow.png';
      } else if (conumption > 0.8) {
        iconUrl = 'assets/images/marker-icon-2x-red.png';
      }
    } else if (razlika < -prag) {
      iconUrl = 'assets/images/marker-icon-2x-lime.png';
      if (production < 0.17) {
        iconUrl = 'assets/images/marker-icon-2x-turquoise.png';
      } else if (production > 0.21) {
        iconUrl = 'assets/images/marker-icon-2x-lightgreen.png';
      }
    }
    return iconUrl;
  }
}
