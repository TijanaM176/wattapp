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
import { EmployeesComponent } from './components/employees/employees.component';
import { EmployeedetailsComponent } from './components/employeedetails/employeedetails.component';


@NgModule({
  declarations: [
    AppComponent,
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
    EmployeesComponent,
    EmployeedetailsComponent,
  ],
  imports: [
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
    Ng2SearchPipeModule
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
