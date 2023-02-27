import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkersComponent } from './workers/workers.component';
import { ShowWorkersComponent } from './workers/show-workers/show-workers.component';
import { AddEditWorkersComponent } from './workers/add-edit-workers/add-edit-workers.component';
import { SharedServiceService } from './shared-service.service';

@NgModule({
  declarations: [
    AppComponent,
    WorkersComponent,
    ShowWorkersComponent,
    AddEditWorkersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SharedServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
