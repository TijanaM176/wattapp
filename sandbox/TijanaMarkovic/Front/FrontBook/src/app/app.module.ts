import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BooksDetailsComponent } from './books-details/books-details.component';
import { BooksDetailsFormComponent } from './books-details/books-details-form/books-details-form.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { HttpClientModule } from '@angular/common/http';

import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    BooksDetailsComponent,
    BooksDetailsFormComponent
  ],
  imports: [
     BrowserModule,
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
