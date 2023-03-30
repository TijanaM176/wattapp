import { Component, OnInit } from '@angular/core';
import { UsersServiceService } from 'src/app/services/users-service.service';
import { Neighborhood } from 'src/app/models/neighborhood';
import { Options, LabelType } from '@angular-slider/ngx-slider';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  minValueP: number = 0;
  maxValueP: number = 1000;
  optionsP: Options = {
    floor: 0,
    ceil: 1000,
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
  maxValueC: number = 1000;
  optionsC: Options = {
    floor: 0,
    ceil: 1000,
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
  constructor(private userService: UsersServiceService) {}

  ChangeNeighborhood(e: any) {
    this.dropDownNeigh = e.target.value;
  }

  ngOnInit() {
    this.userService.getAllNeighborhoods().subscribe((response) => {
      this.Neighborhoods = response;
    });
  }

  filterwithoutNeighborhood() {
    this.userService
      .prosumerFilter(
        this.minValueC,
        this.maxValueC,
        this.minValueP,
        this.maxValueP,
        this.minValue,
        this.maxValue
      )
      .subscribe((response) => {
        console.log(
          this.minValueC,
          this.maxValueC,
          this.minValueP,
          this.maxValueP,
          this.minValue,
          this.maxValue
        );
        this.userService.prosumers = response;
        console.log(response);
      });
  }
  filterwithNeighborhood() {
    this.userService
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
        this.userService.prosumers = response;
        console.log(response);
      });
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
    this.maxValueC = 1000;
    this.minValueP = 0;
    this.maxValueP = 10000;
    this.minValue = 0;
    this.maxValue = 50;
    this.userService.refreshList();
  }
}
