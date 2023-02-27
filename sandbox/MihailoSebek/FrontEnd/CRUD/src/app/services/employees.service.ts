import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import {Employee} from "../models/Employee";

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor(private http: HttpClient) {}

  getAllEmployees():Observable<Employee[]>{
    return this.http.get<Employee[]>("http://localhost:5063/api/employees");
  }
}
