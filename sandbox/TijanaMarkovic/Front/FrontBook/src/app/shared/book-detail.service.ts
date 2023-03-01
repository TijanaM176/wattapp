import { Injectable } from '@angular/core';
import { BookDetail } from './book-detail.model';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom} from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class BookDetailService {

  constructor(private http:HttpClient) { }

  readonly baseURL='https://localhost:7055/api/BookDetails';
  formData:BookDetail=new BookDetail();
  list:BookDetail[];
  postBookDetail(){
    return this.http.post(this.baseURL,this.formData);
  }
  putBookDetail()
  {
    return this.http.put(this.baseURL + `/${this.formData.bookID}`, this.formData);
    
  }

  deleteBookDetail(id:number)
  {
    return this.http.delete(this.baseURL + "/" + id);
  }

  refreshList(){
    lastValueFrom(this.http.get(this.baseURL))
    .then(res=>this.list = res as BookDetail[] )
  }
}
