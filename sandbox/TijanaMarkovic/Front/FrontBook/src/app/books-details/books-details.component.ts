import { Component, OnInit } from '@angular/core';
import { BookDetail } from '../shared/book-detail.model';
import { BookDetailService } from '../shared/book-detail.service';
import { ToastrService } from 'ngx-toastr';
import { Toast } from 'ngx-toastr';
@Component({
  selector: 'app-books-details',
  templateUrl: './books-details.component.html',
  styleUrls: ['./books-details.component.css']
})
export class BooksDetailsComponent implements OnInit{
  constructor(public service:BookDetailService,private toastr:ToastrService){}

  ngOnInit():void{
    this.service.refreshList();
    console.log(this.service.list);
  }
  populateForm(selectedRecord:BookDetail){
    this.service.formData=Object.assign({},selectedRecord);
  }
  onDelete(id:number){
    if(confirm('Are you sure to delete this record?'))
    {
    this.service.deleteBookDetail(id)
    .subscribe(
      {
        next:(res)=>{
        this.service.refreshList();
        this.toastr.error("Deleted succesfully", 'Constellation Detail Register');

      },
      error: (err:any) => {console.log("Greska")}
    })
  }
  }
}
