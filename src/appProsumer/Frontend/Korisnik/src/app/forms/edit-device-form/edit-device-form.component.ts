import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Device } from 'src/app/models/device';
import { EditDevice } from 'src/app/models/deviceedit';
import { Models } from 'src/app/models/models';
import { DeviceserviceService } from 'src/app/services/deviceservice.service';

@Component({
  selector: 'app-edit-device-form',
  templateUrl: './edit-device-form.component.html',
  styleUrls: ['./edit-device-form.component.css'],
})
export class EditDeviceFormComponent {
  @Input() deviceData: any;
  @Output() editedBoolean = new  EventEmitter<[boolean]>();

  IpAddress: string = '';
  TypeName: string = '';
  Manufacturer: string = '';
  ModelName: string = '';
  Name: string = '';
  notFilled: boolean = false;
  success: boolean = false;
  failure: boolean = false;
  DsoView!: boolean;
  Modelname!: string;
  models: Models[] = [];
  DsoControl!: boolean;
  model: any = 0;
  ModelId: string = '';
  typeId!: number;
  idDev!: string;
  p: any = 0;

  constructor(
    private service: DeviceserviceService,
    private router1: ActivatedRoute
  ) {}

  ngOnInit(): void {
  }

  loadInfo() {
    this.IpAddress = this.deviceData.IpAddress;
    this.Name = this.deviceData.Name;
    this.ModelName = this.deviceData.ModelName;
    this.DsoControl = this.deviceData.DsoControl;
    this.DsoView = this.deviceData.DsoView;
    this.service.type = this.deviceData.TypeId;
    this.ModelId = this.deviceData.ModelId;
    this.model = this.ModelId;
  }
  resetInfo(devData : any)
  {
    this.allToFalse();
    this.deviceData = devData;
    this.loadInfo();
    this.getModels();
  }
  editInfo() {
    if (this.IpAddress != '' && this.Name != '') {
      this.allToFalse();
      this.idDev = this.router1.snapshot.params['idDev'];
      let device: EditDevice = new EditDevice();
      device.ModelId = this.model;
      device.Name = this.Name;
      device.IpAddress = this.IpAddress;
      device.DsoView = this.DsoView;
      device.DsoControl = this.DsoControl;
      this.service.editInfo(this.idDev, device).subscribe({
        next: (res) => {
          this.allToFalse();
          this.success = true;
          this.editedBoolean.emit([true]);
        },
        error: (err) => {
          this.allToFalse();
          console.log(err.error);
          this.failure = true;
          this.editedBoolean.emit([false]);
        },
      });
    } else {
      this.allToFalse();
      this.notFilled = true;
    }
  }

  private allToFalse() {
    this.notFilled = false;
    this.success = false;
    this.failure = false;
  }
  ChangeModel(e: any) {
    this.p = e.target.value;
  }
  getModels() {
    this.service.getModel().subscribe({
      next: (response) => {
        this.models = response;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  ChangeButtonView() {
    if(this.DsoView == false)
    {
      this.DsoControl = false;
    }
  }
  ChangeButtonControl() {
    if(this.DsoControl == true)
    {
      this.DsoView = true;
    }
  }
}
