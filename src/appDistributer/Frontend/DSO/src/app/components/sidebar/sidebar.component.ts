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

  private filtersSubscription!: Subscription;

  neighborhood: string = 'all';
  Neighborhoods: Neighborhood[] = [];
  dropDownNeigh: string = 'all';

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
        this.setFilters();
      }
    );

    this.disableNeigh = true;
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('sideSidebar')!.style.height = h + 'px';
  }

  setFilters() {
    this.minValueP = this.deviceService.minProd;
    this.maxValueP = this.deviceService.maxProd;
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

    this.minValueC = this.deviceService.minCons;
    this.maxValueC = this.deviceService.maxCons;
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

    this.minValue = this.deviceService.minDevCount;
    this.maxValue = this.deviceService.maxDevCount;
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
    this.deviceService
      .FilterRanges(this.city.toString(), this.dropDownNeigh)
      .subscribe((res) => {
        this.minValueC = res.minCons;
        this.minValueP = res.minProd;
        this.minValue = res.minDevCount;
        this.maxValueC = res.maxCons;
        this.maxValueP = res.maxProd;
        this.maxValue = res.maxDevCount;
      });
  }

  ChangeCity(e: any) {
    if (this.city == -1) {
      this.dropDownNeigh = 'all';
      this.neighborhood = 'all';
      this.disableNeigh = true;
      this.deviceService.FilterRanges('all', 'all').subscribe((res) => {
        this.minValueC = res.minCons;
        this.minValueP = res.minProd;
        this.minValue = res.minDevCount;
        this.maxValueC = res.maxCons;
        this.maxValueP = res.maxProd;
        this.maxValue = res.maxDevCount;
      });
    } else {
      this.getNeighsByCityId(this.city);
      this.dropDownNeigh = 'all';
      this.neighborhood = 'all';
      this.disableNeigh = false;
      this.deviceService
        .FilterRanges(this.city.toString(), 'all')
        .subscribe((res) => {
          this.minValueC = res.minCons;
          this.minValueP = res.minProd;
          this.minValue = res.minDevCount;
          this.maxValueC = res.maxCons;
          this.maxValueP = res.maxProd;
          this.maxValue = res.maxDevCount;
        });
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
          this.minValueC = res.minCons;
          this.minValueP = res.minProd;
          this.minValue = res.minDevCount;
          this.maxValueC = res.maxCons;
          this.maxValueP = res.maxProd;
          this.maxValue = res.maxDevCount;
        });
    } else {
      this.filterWithoutCity();
      this.deviceService
        .FilterRanges(this.city.toString(), this.dropDownNeigh)
        .subscribe((res) => {
          this.minValueC = res.minCons;
          this.minValueP = res.minProd;
          this.minValue = res.minDevCount;
          this.maxValueC = res.maxCons;
          this.maxValueP = res.maxProd;
          this.maxValue = res.maxDevCount;
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
