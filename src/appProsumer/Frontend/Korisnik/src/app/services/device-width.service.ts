import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceWidthService {
  deviceWidth! : number;
  constructor() { }
}
