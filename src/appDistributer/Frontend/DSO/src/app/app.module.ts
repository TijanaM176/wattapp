import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { SignupComponent } from './components/signup/signup.component';
import { SignupWorkerComponent } from './components/signup-worker/signup-worker.component';



@NgModule({
  declarations: [AppComponent, LoginComponent, SignupComponent, SignupWorkerComponent ],

  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule,ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
