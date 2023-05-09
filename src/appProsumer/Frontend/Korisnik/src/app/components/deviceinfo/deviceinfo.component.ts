import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDeviceFormComponent } from 'src/app/forms/edit-device-form/edit-device-form.component';
import { Device } from 'src/app/models/device';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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

  cons: boolean = true;

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
    this.activateBtn('offcanvasUserDevices');
    this.activateButton('sidebarUserDevices');
  }
  formatValue(value: number): string {
    return value.toFixed(4);
  }

  getInformation() {
    this.idDev = this.router1.snapshot.params['idDev'];
    this.service.getInfoDevice(this.idDev).subscribe({
      next: (res) => {
        this.MaxUsage = res.MaxUsage;
        this.AvgUsage = res.AvgUsage;
        this.currentUsage = res.CurrentUsage.toFixed(2);
        if (res.CategoryId == '1') {
          this.gaugeLabel = 'Consumption';
          this.cons = true;
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
        } else if (res.CategoryId == '2') {
          this.gaugeLabel = 'Production';
          this.cons = false;
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
        }
        this.deviceData = res;
        this.IpAddress = res.IpAddress;
        this.TypeName = res.TypeName;
        this.ModelName = res.ModelName;
        this.Name = res.Name;
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
        this.spiner.hide();
        this.deviceData = res;
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
    Swal.fire({
      title: 'Are you sure?',
      text: 'Confirm you want to delete this device.',
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#8d021f',
      cancelButtonColor: '#6a8884',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Cancelled', 'Product still in our database.)', 'error');
      }
    });
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
    }
  }

  toggle() {
    let offOn = this.currentUsage > 0 ? 'Off' : 'On';
    Swal.fire({
      title: 'Are you sure?',
      text: 'Confirm you want to turn this device ' + offOn + '.',
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#466471',
      cancelButtonColor: '#8d021f',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.service
          .toggleDevice(this.router1.snapshot.params['idDev'], true)
          .subscribe((response) => {
            this.currentUsage = response;
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  activateBtn(id: string) {
    const buttons = document.querySelectorAll('.offcanvasBtn');
    buttons.forEach((button) => {
      if (button.id == id) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
  activateButton(id: string) {
    const buttons = document.querySelectorAll('.sidebarBtn');
    buttons.forEach((button) => {
      if (button.id == id) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}
