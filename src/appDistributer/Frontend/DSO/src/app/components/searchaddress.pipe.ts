import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchaddress'
})
export class SearchaddressPipe implements PipeTransform {

  transform(Items: any[], searchAddress:any): any {
    if(!Items || !searchAddress) return Items;

    
    return Items.filter((item:any)=>
      item.Address.toLocaleLowerCase().includes(searchAddress.toLocaleLowerCase()));

  }

}
