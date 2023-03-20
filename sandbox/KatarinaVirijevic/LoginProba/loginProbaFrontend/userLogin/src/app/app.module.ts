import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DasboardComponent } from './components/dashboard/dasboard/dasboard.component';
import { NgToastModule } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DasboardComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
