import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent, 
    LoginComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule, 
    FormsModule, 
    AppRoutingModule,
    ReactiveFormsModule,
    NgToastModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
