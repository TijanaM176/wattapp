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
import { City } from 'src/app/models/city';
import { UserTableMapInitDto } from 'src/app/models/userTableMapInitDto';
import { Prosumer } from 'src/app/models/userstable';

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
  maxValueP: number = 0;
  optionsP: Options = {
    floor: this.minValueP,
    ceil: this.maxValueP,
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
  maxValueC: number = 0;
  optionsC: Options = {
    floor: this.minValueC,
    ceil: this.maxValueC,
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
  maxValue: number = 0;
  options: Options = {
    floor: this.minValue,
    ceil: this.maxValue,
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

  city : number = -1;
  cities : City[] = [];
  disableNeigh : boolean = true;

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

  ChangeCity(e : any)
  {
    if(this.city == -1)
    {
      this.dropDownNeigh = 'b';
      this.neighborhood = 'b';
      this.disableNeigh = true;
    }
    else
    {
      this.getNeighsByCityId(this.city);
      this.dropDownNeigh = 'b';
      this.neighborhood = 'b';
      this.disableNeigh = false;
    }
  }

  ChangeNeighborhood(e: any) {
    this.dropDownNeigh = e.target.value;
  }

  getNeighsByCityId(id : number)
  {
    this.mapService.getNeightborhoodsByCityId(id)
    .subscribe((res)=>{
      this.Neighborhoods = res;
    })
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

    this.mapService.getAllCities().subscribe((res)=>{this.cities = res});
    this.disableNeigh = true;

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

  private setFilters(res : UserTableMapInitDto)
  {
    this.minValueP = Math.ceil(res.minProd);
    this.maxValueP = Math.ceil(res.maxProd);
    this.optionsP = {
      floor: this.minValue,
      ceil: this.maxValueP,
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

    this.minValueC = Math.ceil(res.minCons);
    this.maxValueC = Math.ceil(res.maxCons);
    this.optionsC = {
      floor: this.minValueC,
      ceil: this.maxValueC,
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

    this.minValue = res.minDevCount;
    this.maxValue = res.maxDevCount;
    this.options = {
      floor: this.minValue,
      ceil: this.maxValue,
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
  }

  populateTheMap(map: any) {
    this.deviceServer.ProsumersInfo1().subscribe({
      next: (res) => {
        let response = res as UserTableMapInitDto;
        // console.log(response);
        this.setFilters(response);
        this.users = response.prosumers;
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

  filterwithoutNeighborhood(map: any, cityId : string) {
    this.deleteAllMarkers(map);
    this.deviceServer.prosumerFilterMap(this.minValueC, this.maxValueC, 
      this.minValueP,this.maxValueP, 
      this.minValue, this.maxValue, 
      cityId.toString(), "all")
      .subscribe((res)=>{
        let response = res as UserTableMapInitDto;
        this.users = response.prosumers as Prosumer[];
        this.setFilters(response);
        this.populateTheMap2(map);
      });
  }
  filterwithNeighborhood(map: any, cityId : string) {
    this.deleteAllMarkers(map);
    this.deviceServer.prosumerFilterMap(this.minValueC, this.maxValueC, 
      this.minValueP,this.maxValueP, 
      this.minValue, this.maxValue, 
      cityId.toString(), this.dropDownNeigh)
      .subscribe((res)=>{
        let response = res as UserTableMapInitDto;
        this.users = response.prosumers as Prosumer[];
        this.setFilters(response);
        this.populateTheMap2(map);
      });
  }

  filterWithCity()
  {
    if(this.dropDownNeigh==='b' || this.dropDownNeigh === '')
    {
      this.filterwithoutNeighborhood(this.map, this.city.toString());
    }
    else
    {
      this.filterwithNeighborhood(this.map, this.city.toString());
    }
  }
  filterWithoutCity()
  {
    this.filterwithoutNeighborhood(this.map, "all");
  
  }

  filter() {
    if(this.city != -1)
    {
      this.filterWithCity();
    }
    else
    {
      this.filterWithoutCity();
    }
  }

  reset() {
    this.deleteAllMarkers(this.map);
    // this.mapService.getAllNeighborhoods().subscribe((response) => {
    //   this.users = response;
    //   this.populateTheMap(this.map);
    // });
    this.deviceServer.ProsumersInfo1()
    .subscribe((res)=>{
      let response = res as UserTableMapInitDto;
      this.users = response.prosumers as Prosumer[];
      this.populateTheMap(this.map);
      this.setFilters(response);
    });
    this.city = -1;
    this.dropDownNeigh = 'b';
    this.neighborhood = 'b';
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
