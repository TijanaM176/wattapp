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
    this.service.category = -1;
    this.c.getCategories();
    this.service.type = -1;
    this.c.getTypes();
    this.service.model = '';
    this.c.getModels();
    this.c.category = -1;
    this.c.Name = 'Device Name';
    this.c.DsoView = false;
    this.c.DsoControl = false;
  }
  registerDevice() {
    console.log(this.service.category);
    console.log(this.service.type);
    console.log(this.service.model);
    this.service.id = this.cookie.get('id');
    let device: AddDevice = new AddDevice();
    device.modelId = this.service.model;
    device.name = this.service.name;
    device.dsoView = this.service.dsoView;
    device.dsoControl = this.service.dsoControl;
    this.service.RegisterDevice(device).subscribe({
      next: (response) => {
        this.toast.success('Success!', 'New Device Added', {
          timeOut: 2500,
        });
        this.success = true;
      },
      error: (err) => {
        console.log(err.error);
        this.failure = true;
      },
    });
    console.log(this.router.url);
    this.currentRoute=this.router.url;
    if (this.router.url == '/ProsumerApp/userDevices') {
      this.router.navigateByUrl('',{skipLocationChange:true}).then(()=>{
        this.router.navigate([this.router.url]);
      });
    } else {
      this.router.navigate(['/ProsumerApp/userDevices']);
    }
  }
  private allToFalse() {
    this.success = false;
    this.failure = false;
  }
}
