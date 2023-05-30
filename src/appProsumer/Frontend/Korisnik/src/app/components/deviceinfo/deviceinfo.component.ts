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
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { RealizationDeviceComponent } from '../Charts/realizationDevice/realizationDevice.component';
import { PredictionDeviceComponent } from '../Charts/predictionDevice/predictionDevice.component';

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
  activity! : number;
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

  gaugeLabel = 'Consumption (kWh)';
  gaugeAppendText = '';

  cat: number = 0;
  catName: string = '';

  //battery
  maxCapacity: number = 0;
  currentCapacity: number = 0;
  percentFull: number = 0;
  state: number = 0; //iskljuceno

  batteryNofit : string = '';
  showBattery : boolean = false;
  showBatteryError : boolean = false;

  @ViewChild('editData', { static: true }) editData!: EditDeviceFormComponent;

  @ViewChild('realizationDevice', {static: true}) realizationDevice! : RealizationDeviceComponent;
  @ViewChild('predictionDevice', {static: true}) predictionDevice! : PredictionDeviceComponent;

  constructor(
    private router: Router,
    private service: DeviceserviceService,
    private toast: ToastrService,
    private router1: ActivatedRoute,
    private spiner: NgxSpinnerService,
    public widthService: DeviceWidthService
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
        this.activity = res.Activity;
        if (res.CategoryId == '1') {
          this.gaugeLabel = 'Consumption [kWh]';
          this.cat = 1;
          this.catName = 'Consumption';
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
          this.gaugeLabel = 'Production [kWh]';
          this.cat = 2;
          this.catName = 'Production';
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
        } else {
          this.cat = 3;
          this.state = res.Activity;
          this.showBattery = false;
          this.catName = 'Storage';
          let h = window.innerHeight;
          document.getElementById('consumptionLimitBody')!.style.height =
            h * 0.25 + 'px';
          document.getElementById('consumptionLimitCardBody')!.style.height =
            h * 0.38 + 'px';
          this.maxCapacity = res.Wattage;
          this.currentCapacity = res.CurrentUsage;
          this.percentFull = Number(
            ((this.currentCapacity / this.maxCapacity) * 100).toFixed(0)
          );
        }
        this.deviceData = res;
        this.IpAddress = res.IpAddress;
        this.TypeName = res.TypeName;
        this.ModelName = res.ModelName;
        this.Name = res.Name;
        this.realizationDevice.deviceName = this.Name;
        this.predictionDevice.deviceName = this.Name;
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
        this.editData.resetInfo(this.deviceData);
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
    this.editData.resetInfo(this.deviceData);
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
    if(this.cat != 3)
    {
      let offOn = this.activity > 0 ? 'Off' : 'On';
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
              this.activity = response==0? 0 : 1;
              this.currentUsage = response;
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
    else
    {
      if(this.activity == 0) //ukljucivanje baterije
      {
        document.getElementById('openModalBatteryBtnDeviceInfo')!.click();
      }
      else //iskljucivanje baterije
      {
        this.toggleStorage(0);
      }
    }
  }

  toggleStorage(mode : number)
  {
    let state = mode==1? 'Confirm you want to use '+this.Name+'.' : 
                mode==2? 'Confirm you want to charge '+this.Name+'.' : 'Confirm you want to turn Off '+this.Name+'.';

    this.batteryNofit = mode==1 ? 'Battery is now in use!' : mode == 2 ? 'Battery is now charging!' : 'Battery turned Off!';
    // alert(state);
    Swal.fire({
      title: 'Are you sure?',
      text: state,
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#466471',
      cancelButtonColor: '#8d021f',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.showBattery = false;
        this.service.toggleStorageDevice(this.idDev, true, mode)
        .subscribe({
          next:(res)=>{
            this.showBattery = true;
            this.activity = res.State;
            this.state = res.State;
            this.currentCapacity = res.Status;
            document.getElementById('closeModalBatteryBtnDeviceInfo')!.click();
          },
          error:(err)=>{
            console.log(err);
            this.showBatteryError = true;
            document.getElementById('closeModalBatteryBtnDeviceInfo')!.click();
            Swal.fire({
              title: 'Error',
              confirmButtonColor: '#466471',
              text: 'Error! Try again later!',
              icon: 'error',
            });
          }
        })
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {}
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
  reset()
  {
    this.showBattery = false;
    this.showBatteryError = false;
  }

  editedDevice(data : [boolean])
  {
    let isSuccessful = data[0];
    if(isSuccessful)
    {
      this.close();
      document.getElementById('closeEditDeviceInfo')!.click();
      this.toast.success('Information successfully edited.', 'Success!', {timeOut: 2500});
    }
    else
    {
      document.getElementById('closeEditDeviceInfo')!.click();
      this.toast.error('Unable to edit device information.', 'Error!', { timeOut:3000 });
    }
  }
}
