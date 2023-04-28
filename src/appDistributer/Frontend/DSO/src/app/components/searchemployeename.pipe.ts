import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchemployeename'
})
export class SearchemployeenamePipe implements PipeTransform {

  transform(employees: any[], searchName:any): any {
    
    if(!employees || !searchName) return employees;
    
    return employees.filter((item:any)=>{
    if(item.firstName!==null)
       return item.firstName.toLocaleLowerCase().includes(searchName.toLocaleLowerCase())});
      
  }
}
