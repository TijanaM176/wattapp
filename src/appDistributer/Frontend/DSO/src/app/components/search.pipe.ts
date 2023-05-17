import { Pipe, PipeTransform } from '@angular/core';
import { Prosumer } from '../models/userstable';
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(prosumers: any[], searchName: any): any {
    if (!prosumers || !searchName) return prosumers;

    return prosumers.filter((item: any) =>
      (item.firstname + ' ' + item.lastname)
        .toLocaleLowerCase()
        .includes(searchName.toLocaleLowerCase())
    );
  }
}
