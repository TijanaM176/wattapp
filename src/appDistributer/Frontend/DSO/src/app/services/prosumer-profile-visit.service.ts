import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProsumerProfileVisitService {

  usernameProsumer : string = '';
  nameProsumer : string = ''

  constructor() { }

  setData(username : string, name : string)
  {
    this.usernameProsumer = username;
    this.nameProsumer = name;
  }
  
  deleteData()
  {
    this.usernameProsumer = '';
    this.nameProsumer = '';
  }
}
