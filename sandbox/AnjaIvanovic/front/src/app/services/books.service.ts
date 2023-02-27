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

  addBook(book: Book) : Observable<Book>{
    return this.http.post<Book>(this.baseUrl, book);
  }

  updateBook(book: Book) : Observable<Book>{
    return this.http.put<Book>(this.baseUrl + "/" + book.id, book);
  }

  deleteBook(id: String) : Observable<Book>{
    return this.http.delete<Book>(this.baseUrl + "/" + id);
  }
}
