import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
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
  ModelId:string='';

  constructor(
    private router: ActivatedRoute,
    private service: DeviceserviceService
  ) {}

  ngOnInit(): void {
    this.idDev = this.router.snapshot.params['idDev'];
    this.service.getInfoDevice(this.idDev).subscribe((res: any) => {
      console.log(res);
      this.results = res;
      this.IpAddress = res.IpAddress;
        this.TypeName = res.TypeName;
        this.ModelName = res.ModelName;
        this.Name = res.Name;
        this.MaxUsage = res.MaxUsage;
        this.AvgUsage = res.AvgUsage;
        this.currentUsage = res.CurrentUsage;
        this.DsoView = res.DsoView;
        this.DsoControl = res.DsoControl;
        this.TypeId = res.TypeId;
        this.ModelId = res.ModelId;
      this.currentUsage = res['CurrentUsage'];
    });

  }
}
