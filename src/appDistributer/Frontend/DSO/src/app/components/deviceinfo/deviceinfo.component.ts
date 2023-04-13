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
  TypeName: any;
  loader: boolean = true;
  constructor(
    private router: ActivatedRoute,
    private service: DeviceserviceService
  ) {}
  /*infoForm = new FormGroup({
    IpAddress: new FormControl(''),
    TypeName: new FormControl(''),
    Manufacturer: new FormControl(''),
    Name: new FormControl(''),
    MaxUsage: new FormControl(''),
    AvgUsage: new FormControl(''),
  });
*/
  ngOnInit(): void {
    this.idDev = this.router.snapshot.params['idDev'];
    this.service.getInfoDevice(this.idDev).subscribe((res: any) => {
      this.results = res;
      console.log(res);
      /*/this.infoForm=new FormGroup({
        IpAddress: new FormControl(res['IpAddress']),
        TypeName: new FormControl(res['TypeName']),
        Manufacturer: new FormControl(res['Manufacturer']),
        Name: new FormControl(res['Name']),
        MaxUsage: new FormControl(res['MaxUsage']),
        AvgUsage: new FormControl(res['AvgUsage']),
      })*/
      this.currentUsage = res['CurrentUsage'];
    });
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  }
}
