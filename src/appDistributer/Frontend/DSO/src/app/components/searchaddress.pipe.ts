import { Pipe, PipeTransform } from '@angular/core';
import { UsersServiceService } from '../services/users-service.service';
import { UsersComponent } from './users/users.component';
@Pipe({
  name: 'searchaddress'
})
export class SearchaddressPipe implements PipeTransform {
  
  transform(prosumers: any[], searchAddress:any): any {
    
    if(!prosumers || !searchAddress) return prosumers;
    
    return prosumers.filter((item:any)=>{
    if(item.address!==null)
       return item.address.toLocaleLowerCase().includes(searchAddress.toLocaleLowerCase())});
      
  }

}
