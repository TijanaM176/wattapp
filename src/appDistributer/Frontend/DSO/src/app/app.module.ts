import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { SignupComponent } from './components/signup/signup.component';
import { SignupWorkerComponent } from './components/signup-worker/signup-worker.component';
import { NavBarComponent } from './components/navBar/navBar.component';
import { HomeComponent } from './components/Home/Home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersComponent } from './components/users/users.component';

import { SearchPipe } from './components/search.pipe';
import { SearchaddressPipe } from './components/searchaddress.pipe';
import { MininavbarComponent } from './components/mininavbar/mininavbar.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { MapComponent } from './components/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
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
import { SignupWorkerPageComponent } from './components/signup-worker-page/signup-worker-page.component';
import { UserComponent } from './components/user/user.component';
import { SidebarPotrosnjaComponent } from './components/sidebar-potrosnja/sidebar-potrosnja.component';
import { DeviceinfoComponent } from './components/deviceinfo/deviceinfo.component';
import { HistoryProsumerComponent } from './components/Charts/history-Prosumer/history-Prosumer.component';
import { HistoryAllProsumersComponent } from './components/Charts/historyAllProsumers/historyAllProsumers.component';
import { HomeSidebarComponent } from './components/home-sidebar/home-sidebar.component';
import { WorkerProfileComponent } from './components/worker-profile/worker-profile.component';
import { User1Component } from './components/user1/user1.component';
import { PocetnaComponent } from './components/pocetna/pocetna.component';
import { RealizationPredictionAllProsumersComponent } from './components/Charts/realizationPredictionAllProsumers/realizationPredictionAllProsumers.component';
import { Top5ProducersComponent } from './components/Charts/top5Producers/top5Producers.component';
import { PopupAddComponent } from './components/popup-add/popup-add.component';
import { PopupEmpComponent } from './components/popup-emp/popup-emp.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartProsumersComponent } from './components/Charts/PieChartProsumers/PieChartProsumers.component';
import { PredictionAllUsersComponent } from './components/Charts/PredictionAllUsers/PredictionAllUsers.component';
import { OrderModule } from 'ngx-order-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatSortModule } from '@angular/material/sort';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { PredictionProsumerComponent } from './components/Charts/prediction-prosumer/prediction-prosumer.component';
import { UserInfoGaugeComponent } from './components/Charts/user-info-gauge/user-info-gauge.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { RealizationPredictionAllProsumersTableComponent } from './components/chart-tables/realization-prediction-all-prosumers-table/realization-prediction-all-prosumers-table.component';
import { HistoryAllProsumersTableComponent } from './components/chart-tables/history-all-prosumers-table/history-all-prosumers-table.component';
import { PredictionAllProsumersTableComponent } from './components/chart-tables/prediction-all-prosumers-table/prediction-all-prosumers-table.component';
import { PieChartProsumersTableComponent } from './components/chart-tables/pie-chart-prosumers-table/pie-chart-prosumers-table.component';
import { RealizationDeviceComponent } from './components/Charts/realizationDevice/realizationDevice.component';
import { PredictionDeviceComponent } from './components/Charts/predictionDevice/predictionDevice.component';
import { HistoryProsumerTableComponent } from './components/chart-tables/history-prosumer-table/history-prosumer-table.component';
import { PredictionProsumerTableComponent } from './components/chart-tables/prediction-prosumer-table/prediction-prosumer-table.component';
import { RealizationDeviceTableComponent } from './components/chart-tables/realization-device-table/realization-device-table.component';
import { PredictionDeviceTableComponent } from './components/chart-tables/prediction-device-table/prediction-device-table.component';
import { SearchemployeelastnamePipe } from './components/searchemployeelastname.pipe';
import { RealizationChartProductionComponent } from './components/Charts/realization-chart-production/realization-chart-production.component';
import { ChangeWorkerPasswordComponent } from './forms/change-worker-password/change-worker-password.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Mininavbar2Component } from './components/mininavbar2/mininavbar2.component';
import { EditProsumerFormComponent } from './forms/edit-prosumer-form/edit-prosumer-form.component';

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
    HistoryProsumerComponent,
    UserComponent,
    SidebarPotrosnjaComponent,
    DeviceinfoComponent,
    HistoryAllProsumersComponent,
    HomeSidebarComponent,
    WorkerProfileComponent,
    User1Component,
    PocetnaComponent,
    RealizationPredictionAllProsumersComponent,
    Top5ProducersComponent,
    PopupAddComponent,
    PopupEmpComponent,
    PieChartProsumersComponent,
    PredictionAllUsersComponent,
    PredictionProsumerComponent,
    UserInfoGaugeComponent,
    RealizationPredictionAllProsumersTableComponent,
    HistoryAllProsumersTableComponent,
    PieChartProsumersTableComponent,
    RealizationDeviceComponent,
    PredictionDeviceComponent,
    PredictionAllProsumersTableComponent,
    HistoryProsumerTableComponent,
    PredictionProsumerTableComponent,
    RealizationDeviceTableComponent,
    PredictionDeviceTableComponent,
    SearchemployeelastnamePipe,
    RealizationChartProductionComponent,
    ChangeWorkerPasswordComponent,
    Mininavbar2Component,
    EditProsumerFormComponent,
  ],
  imports: [
    MatSlideToggleModule,
    MatCheckboxModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    Ng2SearchPipeModule,
    NgxSliderModule,
    LeafletModule,
    NgxSpinnerModule,
    MatSortModule,
    OrderModule,
    NgxChartsModule,
    NgbModule,
    NgxPaginationModule,
    NgxGaugeModule,
    ToastrModule.forRoot(),
    ImageCropperModule,
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
