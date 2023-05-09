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
  optionsP: Options = {
    floor: 0,
    ceil: 0,
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
    floor: 0,
    ceil: 0,
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
    floor: 0,
    ceil: 0,
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

  private filtersSubscription!: Subscription;

  neighborhood: string = 'b';
  Neighborhoods: Neighborhood[] = [];
  dropDownNeigh: string = 'b';

  city: number = -1;
  cities: City[] = [];
  disableNeigh: boolean = true;

  constructor(
    private userService: UsersServiceService,
    private deviceService: DeviceserviceService
  ) {}

  ngAfterViewInit(): void {
    this.userService.getAllCities().subscribe((res) => {
      this.cities = res;
    });
    this.disableNeigh = true;
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('sideSidebar')!.style.height = h + 'px';
  }

  ngOnInit() {
    this.userService.getAllCities().subscribe((res) => {
      this.cities = res;
    });
    this.filtersSubscription = this.deviceService.information$.subscribe(
      (res) => {
        this.setFilters(res);
      }
    );
    this.disableNeigh = true;
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('sideSidebar')!.style.height = h + 'px';
  }

  setFilters(res: any) {
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

  ChangeNeighborhood(e: any) {
    this.dropDownNeigh = e.target.value;
  }

  ChangeCity(e: any) {
    if (this.city == -1) {
      this.dropDownNeigh = 'b';
      this.neighborhood = 'b';
      this.disableNeigh = true;
    } else {
      this.getNeighsByCityId(this.city);
      this.dropDownNeigh = 'b';
      this.neighborhood = 'b';
      this.disableNeigh = false;
    }
  }
  getNeighsByCityId(id: number) {
    this.userService.getNeightborhoodsByCityId(id).subscribe((res) => {
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
    if (this.dropDownNeigh === 'b' || this.dropDownNeigh === '') {
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
    } else {
      this.filterWithoutCity();
    }
  }

  reset() {
    this.minValueC = 0;
    this.maxValueC = 300;
    this.minValueP = 0;
    this.maxValueP = 300;
    this.minValue = 0;
    this.maxValue = 50;
    this.neighborhood = 'b';
    this.dropDownNeigh = 'b';
    this.city = -1;
    this.deviceService.ProsumersInfo();
  }
}
