import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenWidthService {
  deviceWidth! : number;
  height : number = 0;

  constructor() { }
}
