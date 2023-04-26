import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDeviceFormComponent } from 'src/app/forms/edit-device-form/edit-device-form.component';
import { Device } from 'src/app/models/device';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deviceinfo',
  templateUrl: './deviceinfo.component.html',
  styleUrls: ['./deviceinfo.component.css'],
})
export class DeviceinfoComponent {
  color: ThemePalette = 'accent';
  modalTitle: string = '';
  showEdit: boolean = false;
  IpAddress: string = '';
  Manufacturer: string = '';
  TypeName: string = '';
  TypeId: string = '';
  Name: string = '';
  MaxUsage: string = '';
  ModelName: string = '';
  AvgUsage: string = '';
  deviceData: any;
  disabled = false;
  checked = false;
  currentUsage!: number;
  idDev!: string;
  DsoView!: boolean;
  DsoControl!: boolean;
  ModelId!: string;
  results: any;
  loader: boolean = true;
  width: number = 250;
  consumption: number = 0;
  markers: object = {};
  thresholds: object = {};
  maxUsageNumber: number = 0;

  gaugeLabel = 'Consumption';
  gaugeAppendText = 'kWh';
  @ViewChild('editData', { static: false }) editData!: EditDeviceFormComponent;
  constructor(
    private router: Router,
    private service: DeviceserviceService,
    private toast: ToastrService,
    private router1: ActivatedRoute,
    private spiner: NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w >= 576) {
      document.getElementById('consumptionLimitBody')!.style.height =
        h * 0.6 + 'px';
    } else {
      document.getElementById('consumptionLimitBody')!.style.height =
        h * 0.3 + 'px';
    }
  }
  ngOnInit(): void {
    this.width =
      document.getElementById('consumptionLimitCardBody')!.offsetWidth * 0.9;
    this.getInformation();
    this.spiner.show();
  }
  formatValue(value: number): string {
    return value.toFixed(4);
  }

  getInformation() {
    this.idDev = this.router1.snapshot.params['idDev'];
    //this.idDev=this.router.snapshot.params['idDev'];
    this.service.getInfoDevice(this.idDev).subscribe({
      next: (res) => {
        if (res.CategoryId == '1') {
          this.gaugeLabel = 'Consumption';
        } else if (res.CategoryId == '2') {
          this.gaugeLabel = 'Production';
        }
        this.IpAddress = res.IpAddress;
        this.TypeName = res.TypeName;
        this.ModelName = res.ModelName;
        this.Name = res.Name;
        this.MaxUsage = res.MaxUsage;
        this.AvgUsage = res.AvgUsage;
        this.currentUsage = res.CurrentUsage.toFixed(2);
        this.DsoView = res.DsoView;
        this.DsoControl = res.DsoControl;
        this.TypeId = res.TypeId;
        this.ModelId = res.ModelId;
        this.maxUsageNumber = Number(this.MaxUsage + Number(this.AvgUsage) / 6);
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
        this.spiner.hide();
      },
      error: (err) => {
        this.toast.error('Error!', 'Unable to load device data.', {
          timeOut: 3000,
        });
        console.log(err.error);
      },
    });
  }
  delete(id: string) {
    if (confirm('Do you want to delete ?')) {
      this.service.deleteDevice(this.idDev).subscribe({
        next: (res) => {
          this.router.navigate(['ProsumerApp/userDevices']);
          console.log('deleted');
        },
        error: (err) => {
          this.toast.error('Error!', 'Unable to delete device data.', {
            timeOut: 3000,
          });
          console.log(err.error);
        },
      });
    }
  }
  edit() {
    this.modalTitle = 'Edit Information';
    this.showEdit = true;
  }
  close() {
    if (this.showEdit) {
      this.loader = true;
      this.showEdit = false;
      this.getInformation();
      setTimeout(() => {
        this.loader = false;
      }, 2000);
    }

    this.modalTitle = '';
  }
  confirm() {
    if (this.showEdit) {
      this.editData.editInfo();
      //this.showEdit = false;
    }
  }
}
