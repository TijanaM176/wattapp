import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Neighborhood } from 'src/app/models/neighborhood';
import { City } from 'src/app/models/city';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
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

  private initFiltersSubscription!: Subscription;

  neighborhood: string = 'all';
  Neighborhoods: Neighborhood[] = [];
  dropDownNeigh: string = 'all';

  city: number = -1;
  cities: City[] = [];
  disableNeigh: boolean = true;

  disableFiltering : boolean = false;

  constructor(
    private userService: UsersServiceService,
    private deviceService: DeviceserviceService
  ) {}

  ngAfterViewInit(): void {
    this.userService.getAllCitiesProsumers().subscribe((res) => {
      this.cities = res;
    });
    this.disableNeigh = true;
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('sideSidebar')!.style.height = h + 'px';
  }

  ngOnInit() {
    this.disableFiltering = false;
    this.userService.getAllCitiesProsumers().subscribe((res) => {
      this.cities = res;
    });
    this.initFiltersSubscription = this.deviceService.initInfo$.subscribe(
      (res) => {
        this.setFilters();
        this.resetMaxMin();
      }
    );
    this.disableNeigh = true;
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('sideSidebar')!.style.height = h + 'px';
  }

  setFilters() {
    this.staticMinProd = Math.ceil(this.deviceService.minProd);
    this.staticMaxProd = Math.ceil(this.deviceService.maxProd);
    this.minValueP = Math.ceil(this.deviceService.minProd);
    this.maxValueP = Math.ceil(this.deviceService.maxProd);
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

    this.staticMinCons = Math.ceil(this.deviceService.minCons);
    this.staticMaxCons = Math.ceil(this.deviceService.maxCons);
    this.minValueC = Math.ceil(this.deviceService.minCons);
    this.maxValueC = Math.ceil(this.deviceService.maxCons);
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

    this.staticMinDev = Math.ceil(this.deviceService.minDevCount);
    this.staticMaxDev = Math.ceil(this.deviceService.maxDevCount);
    this.minValue = Math.ceil(this.deviceService.minDevCount);
    this.maxValue = Math.ceil(this.deviceService.maxDevCount);
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
  }

  updateFilters(res: any) {
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

  resetMaxMin() {
    this.maxValueP = this.staticMaxProd;
    this.minValueP = this.staticMinProd;

    this.maxValueC = this.staticMaxCons;
    this.minValueC = this.staticMinCons;

    this.maxValue = this.staticMaxDev;
    this.minValue = this.staticMinDev;
  }

  ChangeNeighborhood(e: any) {
    this.disableFiltering = true;
    this.dropDownNeigh = e.target.value;
    this.deviceService
      .FilterRanges(this.city.toString(), this.dropDownNeigh)
      .subscribe((res) => {
        // console.log(res);
        this.updateFilters(res);
      });
  }

  ChangeCity(e: any) {
    this.disableFiltering = true;
    if (this.city == -1) {
      this.dropDownNeigh = 'all';
      this.neighborhood = 'all';
      this.disableNeigh = true;
      this.deviceService.FilterRanges('all', 'all').subscribe((res) => {
        // console.log(res);
        this.updateFilters(res);
      });
    } else {
      this.getNeighsByCityId(this.city);
      this.dropDownNeigh = 'all';
      this.neighborhood = 'all';
      this.disableNeigh = false;
      this.deviceService
        .FilterRanges(this.city.toString(), 'all')
        .subscribe((res) => {
          // console.log(res);
          this.updateFilters(res);
        });
    }
  }
  getNeighsByCityId(id: number) {
    this.userService.getNeightborhoodsByCityIdProsumers(id).subscribe((res) => {
      this.Neighborhoods = res;
    });
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('sideSidebar')!.style.height = h + 'px';
  }

  filterwithoutNeighborhood(cityId: string) {
    this.deviceService.prosumerFilter(
      this.minValueC,
      this.maxValueC,
      this.minValueP,
      this.maxValueP,
      this.minValue,
      this.maxValue,
      cityId.toString(),
      'all'
    );
  }
  filterwithNeighborhood(cityId: string) {
    this.deviceService.prosumerFilter(
      this.minValueC,
      this.maxValueC,
      this.minValueP,
      this.maxValueP,
      this.minValue,
      this.maxValue,
      cityId.toString(),
      this.dropDownNeigh
    );
  }

  filterWithCity() {
    if (this.dropDownNeigh == 'all' || this.dropDownNeigh == '') {
      this.filterwithoutNeighborhood(this.city.toString());
    } else {
      this.filterwithNeighborhood(this.city.toString());
    }
  }
  filterWithoutCity() {
    this.filterwithoutNeighborhood('all');
  }

  filter() {
    if (this.city != -1) {
      this.filterWithCity();
      this.deviceService
        .FilterRanges(this.city.toString(), this.dropDownNeigh)
        .subscribe((res) => {
          this.staticMinCons = res.minCons;
          this.staticMinProd = res.minProd;
          this.staticMinDev = res.minDevCount;
          this.staticMaxCons = res.maxCons;
          this.staticMaxProd = res.maxProd;
          this.staticMaxDev = res.maxDevCount;
        });
    } else {
      this.filterWithoutCity();
      this.deviceService.FilterRanges('all', 'all').subscribe((res) => {
        this.staticMinCons = res.minCons;
        this.staticMinProd = res.minProd;
        this.staticMinDev = res.minDevCount;
        this.staticMaxCons = res.maxCons;
        this.staticMaxProd = res.maxProd;
        this.staticMaxDev = res.maxDevCount;
      });
    }
  }

  reset() {
    this.neighborhood = 'all';
    this.dropDownNeigh = 'all';
    this.city = -1;
    this.deviceService.ProsumersInfo();
  }
}
