import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router, RouterConfigOptions } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/models/device';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-deviceinfo',
  templateUrl: './deviceinfo.component.html',
  styleUrls: ['./deviceinfo.component.css'],
})
export class DeviceinfoComponent implements OnInit {
  color: ThemePalette = 'accent';
  disabled = false;
  checked = false;
  currentUsage!: number;
  idDev!: string;
  results: Device = new Device();
  loader: boolean = true;
  IpAddress: string = '';
  Manufacturer: string = '';
  TypeName: string = '';
  TypeId: string = '';
  Name: string = '';
  MaxUsage: number = 0;
  ModelName: string = '';
  AvgUsage: number = 0;
  DsoView!: boolean;
  DsoControl!: boolean;
  ModelId: string = '';
  maxUsageNumber!: number;
  markers: object = {};
  thresholds: object = {};
  width: number = 250;
  type: string = '';

  constructor(
    private router: ActivatedRoute,
    private service: DeviceserviceService,
    private spiner: NgxSpinnerService,
    private router1: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.width =
      document.getElementById('consumptionLimitCardBody')!.offsetWidth * 0.6;
    this.getInfo();
    this.spiner.show();
  }
  getInfo() {
    this.idDev = this.router.snapshot.params['idDev'];
    this.service.getInfoDevice(this.idDev).subscribe((res: any) => {
      // console.log(res);
      this.setType(res.CategoryId);
      this.results = res;
      this.IpAddress = res.IpAddress;
      this.TypeName = res.TypeName;
      this.ModelName = res.ModelName;
      this.Name = res.Name;
      this.MaxUsage = res.MaxUsage;
      this.AvgUsage = res.AvgUsage;
      this.currentUsage = res.CurrentUsage;
      this.maxUsageNumber = Number(this.MaxUsage + Number(this.AvgUsage) / 6);
      this.DsoView = res.DsoView;
      this.DsoControl = res.DsoControl;
      this.TypeId = res.TypeId;
      this.ModelId = res.ModelId;
      this.markers = {
        '0': { color: 'black', label: '0kWh', fontSize: '16px' },
        [this.AvgUsage]: {
          color: 'black',
          label: `${this.AvgUsage}` + 'kWh',
          fontSize: '16px',
        },
        [this.MaxUsage]: {
          color: 'black',
          label: `${this.MaxUsage}` + 'kWh',
          fontSize: '16px',
        },
      };

      this.thresholds = {
        '0': { color: 'green', bgOpacity: 0.2, fontSize: '16px' },
        [this.AvgUsage]: {
          color: '#d96d2a',
          bgOpacity: 0.2,
          fontSize: '16px',
        },
        [this.MaxUsage]: {
          color: '#c14b48',
          bgOpacity: 0.2,
          fontSize: '16px',
        },
      };
    });
  }
  formatValue(value: number): string {
    return value.toFixed(4);
  }

  setType(typeId: number) {
    if (typeId == 1) {
      this.type = 'Consumption';
    } else if (typeId == 2) {
      this.type = 'Production';
    } else {
      this.type = 'Storage';
    }
  }
  toggle() {
    this.service
      .toggleDevice(this.router.snapshot.params['idDev'], true)
      .subscribe(
        (response) => {
          this.currentUsage = response;
        },
        (error) => {
          this.toastr.error(error.error, 'Error');
        }
      );
  }
}
