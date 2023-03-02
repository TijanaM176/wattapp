import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../modeli/studenti.model';

@Injectable({
  providedIn: 'root'
})
export class StudentiService {

  baseUrl = 'https://localhost:7186/api/Student';
  constructor(private http: HttpClient) { }


//uzimi sve studente!
  getAllStudents() : Observable<Student[]> 
  {
    return this.http.get<Student[]>(this.baseUrl);

  }
  addStudent(student: Student) :  Observable<Student>{
    student.id = '00000000-0000-0000-0000-000000000000'; //zbog grske
    return this.http.post<Student>(this.baseUrl, student);
  }
 
  deleteStudentX(id: string) : Observable<Student>{
    
    return this.http.delete<Student>(this.baseUrl + '/' + id);

  }

}
