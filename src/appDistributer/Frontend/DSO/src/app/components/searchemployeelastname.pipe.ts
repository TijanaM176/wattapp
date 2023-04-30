import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchemployeelastname'
})
export class SearchemployeelastnamePipe implements PipeTransform {

  transform(employees: any[], searchLastName:any): any {
    
    if(!employees || !searchLastName) return employees;
    
    return employees.filter((item:any)=>{
    if(item.lastName!==null)
       return item.lastName.toLocaleLowerCase().includes(searchLastName.toLocaleLowerCase())});
      
  }

}
