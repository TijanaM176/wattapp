import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  baseUrl = "https://localhost:7242/api/books"
  constructor(private http: HttpClient) { }

  getAllBooks() : Observable<Book[]>{
    return this.http.get<Book[]>(this.baseUrl);
  }
}
