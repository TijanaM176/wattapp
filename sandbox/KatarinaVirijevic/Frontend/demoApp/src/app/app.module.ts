import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkersComponent } from './workers/workers.component';
import { ShowWorkersComponent } from './workers/show-workers/show-workers.component';
import { AddEditWorkersComponent } from './workers/add-edit-workers/add-edit-workers.component';
import { SharedServiceService } from './shared-service.service';

//register http client
import {HttpClientModule} from '@angular/common/http';

//import other modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WorkersComponent,
    ShowWorkersComponent,
    AddEditWorkersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SharedServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
