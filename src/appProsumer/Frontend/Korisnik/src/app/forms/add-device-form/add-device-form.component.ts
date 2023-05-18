import { Component } from '@angular/core';
import { mode } from 'd3';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/categories';
import { Models } from 'src/app/models/models';
import { DeviceType } from 'src/app/models/types';
import { AdddeviceserviceService } from 'src/app/services/adddeviceservice.service';

@Component({
  selector: 'app-add-device-form',
  templateUrl: './add-device-form.component.html',
  styleUrls: ['./add-device-form.component.css'],
})
export class AddDeviceFormComponent {

  notFilled: boolean = false;
  success: boolean = false;
  failure: boolean = false;
  categories: Category[] = [];

  category: number = -1;
  type: number = -1;
  model: any = -1;

  dropdownType : boolean = false;
  dropdownModel : boolean = false;

  types: DeviceType[] = [];
  models: Models[] = [];
  Name: string = '';
  manufacturer: string = '';
  DsoView: boolean = false;
  DsoControl: boolean = false;
  id: string = '';
  
  maxlength: number = 18;

  showError : boolean = false;

  constructor(
    private service: AdddeviceserviceService,
    private cookie: CookieService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.dropdownType = false;
    this.dropdownModel = false;
    this.service.dsoView = false;
    this.service.dsoControl = false;
    this.service.category = -1;
    this.service.type = -1;
    this.service.model = '-1';
    this.service.name = '';
    this.getCategories();
  }

  ChangeCategory(e: any) {
    this.resetError();
    if(this.category != -1)
    {
      this.dropdownType = true;
      this.model = -1;
      this.Name = '';
      this.service.category = this.category;
      this.service.type = -1;
      this.service.model = '-1';
      this.service.name = '';
      this.getTypes();
      this.type = -1;
    }
    else
    {
      this.type = -1;
      this.dropdownType = false;
      this.model = -1;
      this.dropdownModel = false;
      this.Name = '';
      this.service.category = -1;
      this.service.type = -1;
      this.service.model = '-1';
      this.service.name = '';
    }
  }

  getCategories() {
    this.service.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  ChangeType(e: any) {
    this.resetError();
    if(this.type != -1)
    {
      this.model = -1;
      this.dropdownModel = true;
      this.service.type = this.type;
      this.service.model = '-1';
      this.service.name = '';
      this.getModels();
    }
    else
    {
      this.model = -1;
      this.dropdownModel = false;
      this.Name = '';
      this.service.type = -1;
      this.service.model = '-1';
      this.service.name = '';
    }
  }
  
  getTypes() {
    this.service.getTypes().subscribe({
      next: (response) => {
        this.types = response;

        this.dropdownType = true;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  ChangeModels(e: any) {
    this.resetError();
    if(this.model != -1)
    {
      this.service.model = this.model.id;
      this.Name = this.model.name;
      this.service.name = this.Name;
    }
    else
    {
      this.service.model = '-1';
      this.Name = '';
      this.service.name = '';
    }
  }

  getModels() {
    
    this.service.getModels().subscribe({
      next: (response) => {
        this.models = response;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  ChangeName(e: any) {
    this.service.name = this.Name;
  }
  
  ChangeButtonView() {
    this.service.dsoView = this.DsoView;
    if(this.DsoView == false)
    {
      this.DsoControl = false;
      this.service.dsoControl = this.DsoControl;
    }
  }
  ChangeButtonControl() {
    this.service.dsoControl = this.DsoControl;
    if(this.DsoControl == true)
    {
      this.DsoView = true;
      this.service.dsoView = this.DsoView;
    }
  }

  error()
  {
    this.showError = true;
  }
  resetError()
  {
    this.showError = false;
  }
}
