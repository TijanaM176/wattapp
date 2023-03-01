import { Component,OnInit } from '@angular/core';
import { BookDetailService } from 'src/app/shared/book-detail.service';
import{NgForm} from '@angular/forms';
import { BookDetail } from 'src/app/shared/book-detail.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-books-details-form',
  templateUrl: './books-details-form.component.html',
  styleUrls: ['./books-details-form.component.css']
})
export class BooksDetailsFormComponent{
  constructor(public service:BookDetailService,
    private toastr: ToastrService){}
  
  onSubmit(form:NgForm){
    
        this.insertRecord(form);
        
        this.updateRecord(form);


    
  }
  insertRecord(form:NgForm){
    this.service.postBookDetail().subscribe(
      { next:(res) => {
      this.resetForm(form);
      this.service.refreshList();
      this.toastr.success('Submitted successfully','Constellation Detail Register');
      },
      error:  (err:any) => { console.log(err); }
    });
  }
  updateRecord(form:NgForm){
    this.service.putBookDetail().subscribe({
      next:(res)=> {
        this.resetForm(form);
        this.service.refreshList();
        this.toastr.info('Updated successfully','Constellation Detail Register')
        },
        error:(err:any) => { console.log(err); }
      });
  }
  resetForm(form:NgForm){
    form.form.reset();
    this.service.formData=new BookDetail();
  }
}
