import { Component, OnInit } from '@angular/core';
import { Student } from './modeli/studenti.model';
import { StudentiService } from './service/studenti.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Studenti';
  listaS: Student[] = [];
  student : Student = {
    id: '',
    ime: '',
    prezime : '',
    indeks : '',
    pol: ''

  };
 constructor(private studentiService: StudentiService)
 {

 }
  ngOnInit(): void {
    this.dajMiSveStudente();

  }

  dajMiSveStudente()
  {
    this.studentiService.getAllStudents()
    .subscribe(
      response =>{
        this.listaS = response;
      
      
      
      }
    );
  }
  onSubmit()
  {
    this.studentiService.addStudent(this.student)
    .subscribe(
        response =>{
          this.dajMiSveStudente(); // da bi dovelo novog studenta
          this.student = {

            id: '',
            ime: '',
            prezime : '',
            indeks : '',
            pol: ''
          };
        }

    )

  }
  deleteStudent(id: string)
  {
    this.studentiService.deleteStudentX(id)
    .subscribe(

      response =>{
        this.dajMiSveStudente(); 

      }
    );
  }
}
