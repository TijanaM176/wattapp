import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DeviceWidthService } from 'src/app/services/device-width.service';
import { fromEvent, Observable, Subscription, timeout } from 'rxjs';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BatteryToggle } from 'src/app/models/batteryToggle';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css'],
})
export class HouseComponent implements OnInit, AfterViewInit {
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  devices: any[] = [];

  @Output() deviceOffOn = new EventEmitter<[any[], number, number, string]>();
  offOn: string = 'On';
  lastState: string = 'Off';
  name: string = '';
  index: number = 0;
  device: any;
  show: boolean = false;
  showBattery : boolean = false;
  showBatteryError : boolean = false;
  batteryNofit : string = '';
  lastValue: number = 0;
  show1!: boolean;

  constructor(
    private widthService: DeviceWidthService,
    private deviceService: DeviceserviceService,
    private router: Router,
    private spiner: NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    const houseCont = document.getElementById('houseCont');
    let houseHeight;
    if (window.innerHeight >= window.innerWidth * 2) {
      houseHeight = this.widthService.height * 0.5;
    } else {
      houseHeight = this.widthService.height * 0.6;
    }
    houseCont!.style.height = houseHeight + 'px';
  }

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize');

    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
      const houseCont = document.getElementById('houseCont');
      let houseHeight;
      if (window.innerHeight >= window.innerWidth * 2) {
        houseHeight = this.widthService.height * 0.45;
      } else {
        houseHeight = this.widthService.height * 0.6;
      }
      houseCont!.style!.height = houseHeight + 'px';
    });
  }

  setDevices(devices: any[]) {
    this.devices = devices;
  }

  navigateToPage() {
    const closeModalBtn = document.getElementById('closeturnDeviceOffOn');
    closeModalBtn!.click();
    this.router.navigate([
      'ProsumerApp/userDevices/' + this.device.Id + '/deviceinfo',
    ]);
  }

  turnDeviceoffOn() {
    this.reset();
    if(this.device.CategoryId != 3)
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Confirm you want to turn this device ' + this.offOn + '.',
        icon: 'question',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: '#466471',
        cancelButtonColor: '#8d021f',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.value) {
          this.show = false;
          this.deviceService
            .toggleDevice(this.device.Id, true)
            .subscribe((response) => {
              console.log(response);
              let active = 1;
              if (response == 0) {
                this.lastValue = this.device.CurrentUsage;
                active = 0;
              }
              this.devices[this.index].CurrentUsage = response;
              this.devices[this.index].Activity = active;
              this.device.CurrentUsage = response;
              this.offOn = this.device.Activity > 0 ? 'Off' : 'On';
              this.lastState = this.device.Activity > 0 ? 'On' : 'Off';
              this.show = true;
              this.deviceOffOn.emit([
                this.devices,
                this.device.CurrentUsage,
                this.lastValue,
                this.device.CategoryId,
              ]);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
    else
    {
      if(this.device.Activity == 0) //ukljucivanje bateriju
      {
        document.getElementById('closeModalBtn')!.click();
        document.getElementById('openModalBatteryBtn')!.click();
      }
      else //iskljuci bateriju
      {
        this.toggleStorage(0);
      }
    }
    
  }

  toggleStorage(mode : number)
  {
    let state = mode==1? 'Confirm you want to use '+this.device.Name+'.' : 
                mode==2? 'Confirm you want to charge '+this.device.Name+'.' : 'Confirm you want to turn Off '+this.device.Name+'.';

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
        this.deviceService.toggleStorageDevice(this.device.Id, true, mode)
        .subscribe({
          next:(res)=>{
            this.showBattery = true;
            this.devices[this.index].CurrentUsage = res.Status;
            this.devices[this.index].Activity = res.State;
            this.devices[this.index].Wattage = res.Capacity;
            this.device.CurrentUsage = res.Status;
            this.device.Activity = res.State;
            this.device.Wattage = res.Capacity;
            this.deviceOffOn.emit([
              this.devices,
              this.device.Activity,
              res.Capacity,
              this.device.CategoryId,
            ]);
          },
          error:(err)=>{
            console.log(err);
            this.showBatteryError = true;
          }
        })
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {}
    });
  }

  selectedDevice(index: number) {
    this.index = index;
    this.device = this.devices[this.index];
    this.name = this.device.Name;
    this.offOn = this.device.CurrentUsage > 0 ? 'Off' : 'On';
  }

  reset() {
    this.show = false;
    this.showBattery = false;
    this.showBatteryError = false;
  }
}
