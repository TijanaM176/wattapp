import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Ng5SliderModule } from 'ng5-slider';

import { SignupComponent } from './components/signup/signup.component';
import { SignupWorkerComponent } from './components/signup-worker/signup-worker.component';
import { NavBarComponent } from './components/navBar/navBar.component';
import {
  NavbarModule,
  DropdownModule,
  IconModule,
  CollapseModule,
  ButtonModule,
  SidebarModule,
} from 'ng-cdbangular';
import { HomeComponent } from './components/Home/Home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersComponent } from './components/users/users.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchPipe } from './components/search.pipe';
import { SearchaddressPipe } from './components/searchaddress.pipe';
import { NeighborhoodComponent } from './components/Filters/neighborhood/neighborhood.component';
import { MininavbarComponent } from './components/mininavbar/mininavbar.component';
import { ConsumptionFilterComponent } from './components/Filters/consumptionFilter/consumptionFilter.component';
import { ProductionFilterComponent } from './components/Filters/productionFilter/productionFilter.component';
import { NumberOfDevicesComponent } from './components/Filters/numberOfDevices/numberOfDevices.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { MapComponent } from './components/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    AppComponent,
    MininavbarComponent,
    LoginComponent,
    DashboardComponent,
    SignupComponent,
    SignupWorkerComponent,
    NavBarComponent,
    HomeComponent,
    SidebarComponent,
    UsersComponent,
    SearchPipe,
    SearchaddressPipe,
    NeighborhoodComponent,
    ConsumptionFilterComponent,
    ProductionFilterComponent,
    NumberOfDevicesComponent,
    EmployeesComponent,
    MapComponent,
  ],
  imports: [
    Ng5SliderModule,
    DropDownListModule,
    BrowserAnimationsModule,
    NavbarModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgToastModule,
    DropdownModule,
    IconModule,
    CollapseModule,
    ButtonModule,
    BrowserModule,
    SidebarModule,
    Ng2SearchPipeModule,
    NgxSliderModule,
    LeafletModule,
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
