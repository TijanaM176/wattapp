import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchemployeename'
})
export class SearchemployeenamePipe implements PipeTransform {

  transform(employees: any[], searchName:any): any {
    
    if(!employees || !searchName) return employees;
    
    return employees.filter((item:any)=>{
    if(item.username!==null)
       return item.username.toLocaleLowerCase().includes(searchName.toLocaleLowerCase())});
      
  }
}
