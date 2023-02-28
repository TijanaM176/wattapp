import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>('http://localhost:5063/api/employees');
  }

  addEmployee(addEmployeeRequest: Employee): Observable<Employee> {
    addEmployeeRequest.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Employee>(
      'http://localhost:5063/api/employees',
      addEmployeeRequest
    );
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>('http://localhost:5063/api/employees/' + id);
  }

  updateEmployee(
    id: string,
    updateEmployeeRequest: Employee
  ): Observable<Employee> {
    return this.http.put<Employee>(
      'http://localhost:5063/api/employees/' + id,
      updateEmployeeRequest
    );
  }
}
