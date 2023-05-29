import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewEmployeeAddedService {

  isAdded : boolean = false;
  newEmplId : string = '';

  constructor() { }

  add(id : string)
  {
    this.isAdded = true;
    this.newEmplId = id;
  }

  reset()
  {
    this.isAdded = false;
    this.newEmplId = '';
  }
}
