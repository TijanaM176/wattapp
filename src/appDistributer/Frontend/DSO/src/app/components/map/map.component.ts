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
import { index } from 'd3';

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
  searchUsername: string = '';
  minValueP: number = 0;
  maxValueP: number = 0;
  staticMaxProd: number = 0;
  staticMinProd: number = 0;
  optionsP: Options = {
    floor: this.staticMinProd,
    ceil: this.staticMaxProd,
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
  staticMaxCons: number = 0;
  staticMinCons: number = 0;
  optionsC: Options = {
    floor: this.staticMinCons,
    ceil: this.staticMaxCons,
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
  staticMaxDev: number = 0;
  staticMinDev: number = 0;
  options: Options = {
    floor: this.staticMinDev,
    ceil: this.staticMaxDev,
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

  neighborhood: string = 'all';
  Neighborhoods: Neighborhood[] = [];
  dropDownNeigh: string = 'all';

  city: number = -1;
  cities: City[] = [];
  disableNeigh: boolean = true;

  users!: any[];
  markers!: any[];
  currentLocation: any;
  currentLocationIsSet = false;
  currentHour: any;
  allusers!: any[];
  searchAddress: string = '';

  consumpLessThan04Checked : boolean = false;
  consumpBetween0408Checked : boolean = false;
  consumpLessThan08Checked : boolean = false;

  productLessThan017Checked : boolean = false;
  productBetween017021Checked : boolean = false;
  productMoreThan021Checked : boolean = false;

  equalConsumpProduct : boolean = false;

  disableFiltering : boolean = false;

  constructor(
    private mapService: UsersServiceService,
    private widthService: ScreenWidthService,
    public toast: ToastrService,
    private cookie: CookieService,
    private deviceServer: DeviceserviceService
  ) {}

  ChangeCity(e: any) {
    this.disableFiltering = true;
    this.dropDownNeigh = 'all';
    this.neighborhood = 'all';
    if (this.city == -1) {
      this.disableNeigh = true;
      this.deviceServer.FilterRanges('all', 'all').subscribe((res) => {
        this.setFilters(res);
      });
    } else {
      this.getNeighsByCityId(this.city);
      this.disableNeigh = false;
      this.deviceServer
        .FilterRanges(this.city.toString(), 'all')
        .subscribe((res) => {
          this.setFilters(res);
        });
    }
  }
  Allusers() {
    this.deviceServer.ProsumersInfo1().subscribe({
      next: (res) => {
        let response = res as UserTableMapInitDto;
        this.setFilters(response);
        this.allusers = response.prosumers;
      },
      error: (err) => {
        this.toast.error('Error!', 'Unable to retreive prosumer locations.', {
          timeOut: 2500,
        });
        console.log(err.error);
      },
    });
  }
  searchUsers() {
    if(this.consumpLessThan04Checked) this.add04LessCons();
    if(this.consumpLessThan08Checked) this.add08MoreCons();
    if(this.consumpBetween0408Checked) this.addBetween0408Cons();

    if(this.productLessThan017Checked) this.addLessThan017Prod();
    if(this.productBetween017021Checked) this.addBetween017021Prod();
    if(this.productMoreThan021Checked) this.addMoreThan021Prod();

    if(this.equalConsumpProduct) this.addEqualConsProd();

    if (!this.users || !this.searchUsername) {
      if (this.searchAddress) {
        this.deleteAllMarkers(this.map);
        this.users = this.allusers.filter((user: any) =>
          user.address
            .toLocaleLowerCase()
            .includes(this.searchAddress.toLocaleLowerCase())
        );
        this.populateTheMap2(this.map);
        return this.users;
      } else {
        this.deleteAllMarkers(this.map);
        let i = 0;
        while(i < this.allusers.length)
        {
          this.users[i] = this.allusers[i];
          i++;
        }

        this.populateTheMap2(this.map);
        return this.users;
      }
    }
    if (!this.searchUsername) {
      const filteredUsers = this.allusers.filter((user: any) =>
        (user.firstname + ' ' + user.lastname)
          .toLocaleLowerCase()
          .includes(this.searchUsername.toLocaleLowerCase())
      );
      this.users = filteredUsers;
      this.deleteAllMarkers(this.map);
      this.populateTheMap2(this.map);
      return filteredUsers;
    } else {
      const filteredUsers = this.allusers.filter(
        (user: any) =>
          user.address
            .toLocaleLowerCase()
            .includes(this.searchAddress.toLocaleLowerCase()) &&
          (user.firstname + ' ' + user.lastname)
            .toLocaleLowerCase()
            .includes(this.searchUsername.toLocaleLowerCase())
      );
      this.users = filteredUsers;
      this.deleteAllMarkers(this.map);
      this.populateTheMap2(this.map);
      return filteredUsers;
    }
  }
  searchUsersbyAddress() {
    if(this.consumpLessThan04Checked) this.add04LessCons();
    if(this.consumpLessThan08Checked) this.add08MoreCons();
    if(this.consumpBetween0408Checked) this.addBetween0408Cons();

    if(this.productLessThan017Checked) this.addLessThan017Prod();
    if(this.productBetween017021Checked) this.addBetween017021Prod();
    if(this.productMoreThan021Checked) this.addMoreThan021Prod();
    
    if(this.equalConsumpProduct) this.addEqualConsProd();

    if (!this.users || !this.searchAddress) {
      if (this.searchUsername) {
        this.deleteAllMarkers(this.map);
        this.users = this.allusers.filter((user: any) =>
          (user.firstname + ' ' + user.lastname)
            .toLocaleLowerCase()
            .includes(this.searchUsername.toLocaleLowerCase())
        );
        this.populateTheMap2(this.map);
        return this.users;
      } else {
        this.deleteAllMarkers(this.map);
        let i = 0;
        while(i < this.allusers.length)
        {
          this.users[i] = this.allusers[i];
          i++;
        }

        this.populateTheMap2(this.map);
        return this.users;
      }
    }
    if (!this.searchUsername) {
      const filteredUsers = this.allusers.filter((user: any) =>
        user.address
          .toLocaleLowerCase()
          .includes(this.searchAddress.toLocaleLowerCase())
      );
      this.users = filteredUsers;

      this.deleteAllMarkers(this.map);

      this.populateTheMap2(this.map);
      return filteredUsers;
    } else {
      const filteredUsers = this.allusers.filter(
        (user: any) =>
          user.address
            .toLocaleLowerCase()
            .includes(this.searchAddress.toLocaleLowerCase()) &&
          (user.firstname + ' ' + user.lastname)
            .toLocaleLowerCase()
            .includes(this.searchUsername.toLocaleLowerCase())
      );
      this.users = filteredUsers;

      this.deleteAllMarkers(this.map);

      this.populateTheMap2(this.map);
      return filteredUsers;
    }
  }

  ChangeNeighborhood(e: any) {
    this.disableFiltering = true;
    this.dropDownNeigh = e.target.value;
    let c = this.city == -1 ? 'all' : this.city.toString();
    this.deviceServer.FilterRanges(c, this.dropDownNeigh).subscribe((res) => {
      this.setFilters(res);
    });
  }

  getNeighsByCityId(id: number) {
    this.mapService.getNeightborhoodsByCityIdProsumers(id).subscribe((res) => {
      this.Neighborhoods = res;
    });
  }

  ngOnInit(): void {
    this.disableFiltering = false;
    setTimeout(() => {
      this.loader = false;
    }, 3000);
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;

    document.getElementById('sadrzaj')!.style.height = h + 'px';
    document.getElementById('mapCont')!.style.height = h + 'px';
    document.getElementById('side')!.style.height = h + 'px';

    this.mapService.getAllCitiesProsumers().subscribe((res) => {
      this.cities = res;
    });
    this.disableNeigh = true;

    this.currentLocationIsSet = false;
    this.mapService.refreshList();
    this.markers = [];
    this.currentHour = new Date().getHours();

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      let t = window.innerWidth < 320 ? 140.6 : 101;
      let h = window.innerHeight - t;
      document.getElementById('sadrzaj')!.style.height = h + 'px';
      document.getElementById('mapCont')!.style.height = h + 'px';
      document.getElementById('side')!.style.height = h + 'px';
    });
    this.Allusers();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap() {
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('sadrzaj')!.style.height = h + 'px';
    document.getElementById('mapCont')!.style.height = h + 'px';
    document.getElementById('side')!.style.height = h + 'px';

    let map = L.map('map', { minZoom: 8 }); //.setView([44.012794, 20.911423], 15);

    var lat = localStorage.getItem('lat');
    var long = localStorage.getItem('long');
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
      '<h6>Center of region ' + localStorage.getItem('region') + '</h6>'
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
            [Number(localStorage.getItem('lat')), Number(localStorage.getItem('long'))],
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

  private setFilters(res: UserTableMapInitDto) {
    this.staticMinProd = Math.ceil(res.minProd);
    this.staticMaxProd = Math.ceil(res.maxProd);
    this.minValueP = Math.ceil(res.minProd);
    this.maxValueP = Math.ceil(res.maxProd);
    this.optionsP = {
      floor: this.staticMinProd,
      ceil: this.staticMaxProd,
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

    this.staticMinCons = Math.ceil(res.minCons);
    this.staticMaxCons = Math.ceil(res.maxCons);
    this.minValueC = Math.ceil(res.minCons);
    this.maxValueC = Math.ceil(res.maxCons);
    this.optionsC = {
      floor: this.staticMinCons,
      ceil: this.staticMaxCons,
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

    this.staticMinDev = Math.ceil(res.minDevCount);
    this.staticMaxDev = Math.ceil(res.maxDevCount);
    this.minValue = Math.ceil(res.minDevCount);
    this.maxValue = Math.ceil(res.maxDevCount);
    this.options = {
      floor: this.staticMinDev,
      ceil: this.staticMaxDev,
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

    this.disableFiltering = false;
  }

  private resetMaxMin() {
    this.maxValueP = this.staticMaxProd;
    this.minValueP = this.staticMinProd;

    this.maxValueC = this.staticMaxCons;
    this.minValueC = this.staticMinCons;

    this.maxValue = this.staticMaxDev;
    this.minValue = this.staticMinDev;
  }

  populateTheMap(map: any) {
    this.deviceServer.ProsumersInfo1().subscribe({
      next: (res) => {
        let response = res as UserTableMapInitDto;
        this.setFilters(response);
        this.resetMaxMin();
        this.users = response.prosumers;

        let iconUrl = 'assets/images/marker-icon-2x-blueviolet.png';

        for (let user of this.users) {
          let lon = user.longitude;
          let lat = user.latitude;
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
                user.firstname +
                ' ' +
                user.lastname +
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
      let lon = user.longitude;
      let lat = user.latitude;
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

            user.firstname +
            ' ' +
            user.lastname +

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
  close(){
    this.searchUsername='';
    if(this.searchAddress){
      this.deleteAllMarkers(this.map);
        this.users = this.allusers.filter((user: any) =>
          user.address
            .toLocaleLowerCase()
            .includes(this.searchAddress.toLocaleLowerCase())
        );
        this.populateTheMap2(this.map);
    }
    else{
      this.deleteAllMarkers(this.map);
      let i = 0;
      while(i < this.allusers.length)
      {
        this.users[i] = this.allusers[i];
        i++;
      }

    this.populateTheMap2(this.map);
    }
  }
  close1(){
    this.searchAddress='';
    if(this.searchUsername){
      this.deleteAllMarkers(this.map);
        this.users = this.allusers.filter((user: any) =>
          (user.firstname + ' ' + user.lastname)
            .toLocaleLowerCase()
            .includes(this.searchUsername.toLocaleLowerCase())
        );
        this.populateTheMap2(this.map);
    }
    else{
      this.deleteAllMarkers(this.map);
      let i = 0;
      while(i < this.allusers.length)
      {
        this.users[i] = this.allusers[i];
        i++;
      }

    this.populateTheMap2(this.map);
    }
  }

  deleteAllMarkers(map: any) {
    for (var marker of this.markers) {
      map.removeLayer(marker);
    }
    this.markers = [];
  }

  filterwithoutNeighborhood(map: any, cityId: string) {
    this.deleteAllMarkers(map);
    this.deviceServer
      .prosumerFilterMap(
        this.minValueC,
        this.maxValueC,
        this.minValueP,
        this.maxValueP,
        this.minValue,
        this.maxValue,
        cityId.toString(),
        'all'
      )
      .subscribe((res) => {
        this.users = res as Prosumer[];
        this.allusers= res as Prosumer[];
        this.searchUsername='';
        this.searchAddress='';
        this.populateTheMap2(map);
      });
  }
  filterwithNeighborhood(map: any, cityId: string) {
    this.deleteAllMarkers(map);
    this.deviceServer
      .prosumerFilterMap(
        this.minValueC,
        this.maxValueC,
        this.minValueP,
        this.maxValueP,
        this.minValue,
        this.maxValue,
        cityId.toString(),
        this.dropDownNeigh
      )
      .subscribe((res) => {
        this.users = res as Prosumer[];
        this.allusers= res as Prosumer[];
        this.searchUsername='';
        this.searchAddress='';
        this.populateTheMap2(map);
      });
  }

  filterWithCity() {
    if (this.dropDownNeigh === 'b' || this.dropDownNeigh === '') {
      this.filterwithoutNeighborhood(this.map, this.city.toString());
    } else {
      this.filterwithNeighborhood(this.map, this.city.toString());
    }
  }
  filterWithoutCity() {
    this.filterwithoutNeighborhood(this.map, 'all');
  }

  filter() {
    if (this.city != -1) {
      this.filterWithCity();
    } else {
      this.filterWithoutCity();
    }
  }

  reset() {
    this.deleteAllMarkers(this.map);
    this.deviceServer.ProsumersInfo1().subscribe((res) => {
      let response = res as UserTableMapInitDto;
      this.users = response.prosumers as Prosumer[];
      this.populateTheMap(this.map);
      this.setFilters(response);
    });

    // Clear the input values
    this.city = -1;
    this.dropDownNeigh = 'all';
    this.neighborhood = 'all';
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
      if (production <= 0.17) {
        iconUrl = 'assets/images/marker-icon-2x-turquoise.png';
      } else if (production > 0.21) {
        iconUrl = 'assets/images/marker-icon-2x-lightgreen.png';
      }
    }
    return iconUrl;
  }

  //pins consumption
  remove04LessCons()
  {
    this.consumpLessThan04Checked = true;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.users.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.users[i].consumption) - Number(this.users[i].production);
      if(razlika > prag && Number(this.users[i].consumption) <= 0.4)
      {
        this.users.splice(i,1);
      }
      else
      {
        i++;
      }
    }
    this.populateTheMap2(this.map);
  }
  add04LessCons()
  {
    this.consumpLessThan04Checked = false;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.allusers.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.allusers[i].consumption) - Number(this.allusers[i].production);
      if(razlika > prag && Number(this.allusers[i].consumption) <= 0.4)
      {
        this.users.push(this.allusers[i]);
      }
      i++;
    }
    this.populateTheMap2(this.map);
  }

  remove08MoreCons()
  {
    this.consumpLessThan08Checked = true;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.users.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.users[i].consumption) - Number(this.users[i].production);
      if(razlika > prag && Number(this.users[i].consumption) > 0.8)
      {
        this.users.splice(i,1);
      }
      else
      {
        i++;
      }
    }
    this.populateTheMap2(this.map);
  }
  add08MoreCons()
  {
    this.consumpLessThan08Checked = false;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.allusers.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.allusers[i].consumption) - Number(this.allusers[i].production);
      if(razlika > prag && Number(this.allusers[i].consumption) > 0.8)
      {
        this.users.push(this.allusers[i]);
      }
      i++;
    }
    this.populateTheMap2(this.map);
  }

  removeBetween0408Cons()
  {
    this.consumpBetween0408Checked = true;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.users.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.users[i].consumption) - Number(this.users[i].production);
      if(razlika > prag && Number(this.users[i].consumption) > 0.4 && Number(this.users[i].consumption) <= 0.8)
      {
        this.users.splice(i,1);
      }
      else
      {
        i++;
      }
    }
    this.populateTheMap2(this.map);
  }
  addBetween0408Cons()
  {
    this.consumpBetween0408Checked = false;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.allusers.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.allusers[i].consumption) - Number(this.allusers[i].production);
      if(razlika > prag && Number(this.allusers[i].consumption) > 0.4 && Number(this.allusers[i].consumption) <= 0.8)
      {
        this.users.push(this.allusers[i]);
      }
      i++;
    }
    this.populateTheMap2(this.map);
  }

  //pins production
  removeLessThan017Prod()
  {
    this.productLessThan017Checked = true;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.users.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.users[i].consumption) - Number(this.users[i].production);
      if(razlika < -prag && Number(this.users[i].production) <= 0.17)
      {
        this.users.splice(i,1);
      }
      else
      {
        i++;
      }
    }
    this.populateTheMap2(this.map);
  }
  addLessThan017Prod()
  {
    this.productLessThan017Checked = false;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.allusers.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.allusers[i].consumption) - Number(this.allusers[i].production);
      if(razlika < -prag && Number(this.allusers[i].production) <= 0.17)
      {
        this.users.push(this.allusers[i]);
      }
      i++;
    }
    this.populateTheMap2(this.map);
  }

  removeBetween017021Prod()
  {
    this.productBetween017021Checked = true;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.users.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.users[i].consumption) - Number(this.users[i].production);
      if(razlika < -prag && Number(this.users[i].production) > 0.17 && Number(this.users[i].production) <= 0.21)
      {
        this.users.splice(i,1);
      }
      else
      {
        i++;
      }
    }
    this.populateTheMap2(this.map);
  }
  addBetween017021Prod()
  {
    this.productBetween017021Checked = false;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.allusers.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.allusers[i].consumption) - Number(this.allusers[i].production);
      if(razlika < -prag && Number(this.allusers[i].production) > 0.17&& Number(this.allusers[i].production) <= 0.21)
      {
        this.users.push(this.allusers[i]);
      }
      i++;
    }
    this.populateTheMap2(this.map);
  }

  removeMoreThan021Prod()
  {
    this.productMoreThan021Checked = true;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.users.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.users[i].consumption) - Number(this.users[i].production);
      if(razlika < -prag && Number(this.users[i].production) > 0.21)
      {
        this.users.splice(i,1);
      }
      else
      {
        i++;
      }
    }
    this.populateTheMap2(this.map);
  }
  addMoreThan021Prod()
  {
    this.productMoreThan021Checked = false;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.allusers.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.allusers[i].consumption) - Number(this.allusers[i].production);
      if(razlika < -prag && Number(this.allusers[i].production) > 0.21)
      {
        this.users.push(this.allusers[i]);
      }
      i++;
    }
    this.populateTheMap2(this.map);
  }

  //equal consumption and production
  removeEqualConsProd()
  {
    this.equalConsumpProduct = true;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.users.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.users[i].consumption) - Number(this.users[i].production);
      if(!(razlika < -prag || razlika > prag))
      {
        this.users.splice(i,1);
      }
      else
      {
        i++;
      }
    }
    this.populateTheMap2(this.map);
  }
  addEqualConsProd()
  {
    this.equalConsumpProduct = false;
    this.deleteAllMarkers(this.map);
    let i = 0;
    while(i < this.allusers.length)
    {
      let prag = 0.0001;
      let razlika = Number(this.allusers[i].consumption) - Number(this.allusers[i].production);
      if(!(razlika < -prag || razlika > prag))
      {
        this.users.push(this.allusers[i]);
      }
      i++;
    }
    this.populateTheMap2(this.map);
  }
}
