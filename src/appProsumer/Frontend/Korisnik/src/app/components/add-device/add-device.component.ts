import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AddDeviceFormComponent } from 'src/app/forms/add-device-form/add-device-form.component';
import { AddDevice } from 'src/app/models/adddevice';
import { Category } from 'src/app/models/categories';
import { Models } from 'src/app/models/models';
import { DeviceType } from 'src/app/models/types';
import { AdddeviceserviceService } from 'src/app/services/adddeviceservice.service';
import { DeviceCardsComponent } from '../deviceCards/deviceCards.component';
import { NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
})
export class AddDeviceComponent implements OnInit {
  categories: Category[] = [];
  dropDownCategory: boolean = false;
  type!: number;
  currentRoute!: string;
  types: DeviceType[] = [];
  model!: Models;
  models: Models[] = [];
  Name: string = '';
  manufacturer: string = '';
  id: string = '';
  success: boolean = false;
  failure: boolean = false;
  notFilled: boolean = false;
  show: boolean = false;

  @ViewChild('c', { static: false }) c!: AddDeviceFormComponent;

  constructor(
    private service: AdddeviceserviceService,
    private router: Router,
    private cookie: CookieService,
    public toast: ToastrService,
    private active:ActivatedRoute
  ) {
  
  }
  ngOnInit(): void {
    this.show = true;
    this.allToFalse();
  }

  close() {
    if (this.show) {
      this.show = false;
    }
    this.c.getCategories();
    //reset service
    this.service.category = -1;
    this.service.type = -1;
    this.service.model = '-1';
    this.service.name = '';
    this.service.dsoView = false;
    this.service.dsoControl = false;

    //reset form
    this.c.category = -1;
    this.c.type = -1;
    this.c.model = -1;
    this.c.Name = '';
    this.c.DsoView = false;
    this.c.DsoControl = false;
    this.c.dropdownType=false;
    this.c.dropdownModel=false;

    this.c.resetError();
  }
  registerDevice() {
    this.service.id = localStorage.getItem('idProsumer')!;
    this.c.resetError();
    if(this.service.category != -1 && this.service.model != '-1' && this.service.type != -1 && this.service.name != '') //if all fields are populated
    {
      let device: AddDevice = new AddDevice();
      device.modelId = this.service.model;
      device.name = this.service.name;
      device.dsoView = this.service.dsoView;
      device.dsoControl = this.service.dsoControl;
      this.service.RegisterDevice(device).subscribe({
        next: (response) => {
          this.toast.success('Success!', 'New Device Added', {
            timeOut: 1000,
          });
          this.success = true;
          this.currentRoute=this.router.url;
          if (this.router.url === '/ProsumerApp/userDevices') {
            this.router.navigate(['/ProsumerApp/userInfo'],{skipLocationChange:true}).then(()=>{
              // console.log(this.router.url);
              this.router.navigate([this.currentRoute]);
              this.activateBtn('offcanvasUserDevices');
              this.activateButton('sidebarUserDevices');
            });
          } 
          else 
          {
            this.router.navigate(['/ProsumerApp/userDevices']);
            this.activateBtn('offcanvasUserDevices');
            this.activateButton('sidebarUserDevices');
          }
          document.getElementById('closeAddDevice')!.click();
          document.getElementById('addDeviceCloseOffcanvas')!.click();
        },
        error: (err) => {
          console.log(err.error);
          this.failure = true;
          this.toast.error('Error!', 'Unable to add device', {
            timeOut: 500,
          });
          document.getElementById('closeAddDevice')!.click();
          document.getElementById('addDeviceCloseOffcanvas')!.click();
        },
      });
    }
    else
    {
      this.c.error();
    }
  }
  private allToFalse() {
    this.success = false;
    this.failure = false;
  }
  activateBtn(id : string)
  {
    const buttons = document.querySelectorAll('.offcanvasBtn');
    buttons.forEach(button=>{
      if(button.id == id)
      {
        button.classList.add('active');
      }
      else
      {
        button.classList.remove('active');
      }
    })
  }
  activateButton(id : string)
  {
    const buttons = document.querySelectorAll('.sidebarBtn');
    buttons.forEach(button=>{
      if(button.id == id)
      {
        button.classList.add('active');
      }
      else
      {
        button.classList.remove('active');
      }
    });
  }
}
