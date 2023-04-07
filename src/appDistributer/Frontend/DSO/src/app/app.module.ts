import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { NgxSliderModule } from '@angular-slider/ngx-slider';

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
import { MininavbarComponent } from './components/mininavbar/mininavbar.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { MapComponent } from './components/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { StranaUsersComponent } from './components/stranaUsers/stranaUsers.component';
import { MatSliderModule } from '@angular/material/slider';
import { EmployeedetailsComponent } from './components/employeedetails/employeedetails.component';
import { SearchemployeenamePipe } from './components/searchemployeename.pipe';
import { SidebarDsoComponent } from './components/sidebar-dso/sidebar-dso.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { ProsumerinfoComponent } from './components/prosumerinfo/prosumerinfo.component';
import { AddProsumerComponent } from './components/AddProsumer/AddProsumer.component';
import { EmployeeNavBarComponent } from './components/employee-nav-bar/employee-nav-bar.component';
import { RegionComponent } from './components/Filters/region/region.component';
import { RoleComponent } from './components/Filters/role/role.component';
import { TabelaUredjajaComponent } from './components/tabelaUredjaja/tabelaUredjaja.component';
import { UserDevicesComponent } from './components/UserDevices/UserDevices.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ng-cdbangular';

import { SignupWorkerPageComponent } from './components/signup-worker-page/signup-worker-page.component';
import { SidebarEmptyComponent } from './components/sidebar-empty/sidebar-empty.component';

import { UserComponent } from './components/user/user.component';
import { SidebarPotrosnjaComponent } from './components/sidebar-potrosnja/sidebar-potrosnja.component';
import { DeviceinfoComponent } from './components/deviceinfo/deviceinfo.component';
import { HistoryProsumerComponent } from './components/Charts/history-Prosumer/history-Prosumer.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HistoryAllProsumersComponent } from './components/Charts/historyAllProsumers/historyAllProsumers.component';
import { HomeSidebarComponent } from './components/home-sidebar/home-sidebar.component';
import { WorkerProfileComponent } from './components/worker-profile/worker-profile.component';
import { User1Component } from './components/user1/user1.component';
import { PocetnaComponent } from './components/pocetna/pocetna.component';
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    StranaUsersComponent,
    MininavbarComponent,
    LoginComponent,
    DashboardComponent,
    SignupComponent,
    SignupWorkerComponent,
    NavBarComponent,
    HomeComponent,
    UsersComponent,
    SearchPipe,
    SearchaddressPipe,
    EmployeesComponent,
    MapComponent,
    EmployeesComponent,
    MapComponent,
    SidebarDsoComponent,
    EmployeedetailsComponent,
    SearchemployeenamePipe,
    ResetpasswordComponent,
    ProsumerinfoComponent,
    AddProsumerComponent,
    EmployeeNavBarComponent,
    RegionComponent,
    RoleComponent,
    TabelaUredjajaComponent,
    UserDevicesComponent,
    SignupWorkerPageComponent,
    SidebarEmptyComponent,
    HistoryProsumerComponent,
    UserComponent,
    SidebarPotrosnjaComponent,
    DeviceinfoComponent,
    HistoryAllProsumersComponent,
    HomeSidebarComponent,
    WorkerProfileComponent,
    User1Component,
    PocetnaComponent,
  ],
  imports: [
    MatSliderModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
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
    NgxPaginationModule,
    PaginationModule,
    NgxChartsModule,
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
