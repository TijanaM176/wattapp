import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(Items: any[],searchName: any): any {
 
    if(!Items || !searchName) return Items;

    
    return Items.filter((item:any)=>
      item.Username.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()));

  }

}
