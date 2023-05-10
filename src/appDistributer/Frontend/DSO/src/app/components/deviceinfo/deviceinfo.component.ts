import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router, RouterConfigOptions } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Device } from 'src/app/models/device';
import Swal from 'sweetalert2';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { ScreenWidthService } from 'src/app/services/screen-width.service';

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
  cat : number = 0;

   //battery
   maxCapacity: number = 0;
   currentCapacity: number = 0;
   percentFull: number = 0;
   avgFull : number = 0;
   maxFull : number = 0;
   state: number = 0; //iskljuceno

  constructor(
    private router: ActivatedRoute,
    private service: DeviceserviceService,
    private spiner: NgxSpinnerService,
    private router1: Router,
    private toastr: ToastrService,
    public widthService : ScreenWidthService
  ) {}

  ngOnInit(): void {
    this.width =
      document.getElementById('consumptionLimitCardBody')!.offsetWidth * 0.6;
    this.getInfo();
    this.spiner.show();
  }

  turnDeviceoffOn() {
    const ofOn = this.currentUsage > 0 ? 'Off' : 'On';
    Swal.fire({
      title: 'Are you sure?',
      text: 'Confirm you want to turn this device ' + ofOn,
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#466471',
      cancelButtonColor: '#8d021f',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result: any) => {
      if (result.value) {
        this.service
          .toggleDevice(this.router.snapshot.params['idDev'], true)
          .subscribe(
            (response) => {
              this.currentUsage = response;
              let active = true;
              if (response === 0) {
                active = false;
              }
            },
            (error) => {
              Swal.fire({
                title: 'Error',
                confirmButtonColor: '#466471',
                text: "You don't have permission to manage this device.",
                icon: 'error',
              });
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Action when Cancel button is clicked
      }
    });
  }

  getInfo() {
    this.idDev = this.router.snapshot.params['idDev'];
    this.service.getInfoDevice(this.idDev).subscribe((res: any) => {
      this.setType(res.CategoryId);
      this.cat = res.CategoryId;
      this.results = res;
      this.IpAddress = res.IpAddress;
      this.TypeName = res.TypeName;
      this.ModelName = res.ModelName;
      this.Name = res.Name;
      this.MaxUsage = res.MaxUsage;
      this.AvgUsage = res.AvgUsage;
      this.currentUsage = res.CurrentUsage;
      this.DsoControl = res.DsoControl;
      this.DsoView = res.DsoView;
      this.maxUsageNumber = Number(this.MaxUsage + Number(this.AvgUsage) / 6);
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
      if (this.cat == 2) {
        this.thresholds = {
          '0': { color: '#c14b48', bgOpacity: 0.2, fontSize: '16px' },
          [this.AvgUsage]: {
            color: '#d96d2a',
            bgOpacity: 0.2,
            fontSize: '16px',
          },
          [this.MaxUsage]: {
            color: 'green',
            bgOpacity: 0.2,
            fontSize: '16px',
          },
        };
      } else if(this.cat == 1)
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
        }
        else if(this.cat == 3)
        {
          document.getElementById('consumptionLimitBody')!.style.height = this.widthService.height * 0.42 +'px';
          document.getElementById('consumptionLimitBody')!.style.width = this.width + 'px';
          document.getElementById('avgBatteryCard')!.style.height = this.widthService.height * 0.2 + 'px'
          this.maxCapacity = res.Wattage;
          this.currentCapacity = res.CurrentUsage;
          this.percentFull = Number(
            ((this.currentCapacity / this.maxCapacity) * 100).toFixed(0)
          );
          this.avgFull = Number((this.AvgUsage/this.maxCapacity*100).toFixed(0));
          this.maxFull = Number((this.MaxUsage/this.maxCapacity*100).toFixed(0));
        }
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
}
