import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { PocetnaComponent } from './components/Pocetna/Pocetna.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { NavbarOffcanvasComponent } from './components/navbar-offcanvas/navbar-offcanvas.component';
import { SidebarResponsiveComponent } from './components/sidebar-responsive/sidebar-responsive.component';
import { EditInfoFormComponent } from './forms/edit-info-form/edit-info-form.component';
import { ChangePasswordComponent } from './forms/change-password/change-password.component';
import { DeviceinfoComponent } from './components/deviceinfo/deviceinfo.component';
import { DeviceCardsComponent } from './components/deviceCards/deviceCards.component';
import { UserDevicesComponent } from './components/userDevices/userDevices.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { EditDeviceFormComponent } from './forms/edit-device-form/edit-device-form.component';
import { AddDeviceFormComponent } from './forms/add-device-form/add-device-form.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RealizationChartComponent } from './components/Charts/realization-chart/realization-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PredictionChartComponent } from './components/Charts/prediction-chart/prediction-chart.component';
import { HouseComponent } from './components/Charts/house/house.component';
import { DevicesStatusComponent } from './components/Charts/devices-status/devices-status.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PocetnaComponent,
    ResetpasswordComponent,
    UserInfoComponent,
    NavbarOffcanvasComponent,
    SidebarResponsiveComponent,
    EditInfoFormComponent,
    ChangePasswordComponent,
    DeviceinfoComponent,
    DeviceCardsComponent,
    UserDevicesComponent,
    AddDeviceComponent,
    EditDeviceFormComponent,
    AddDeviceFormComponent,
    RealizationChartComponent,
    PredictionChartComponent,
    HouseComponent,
    DevicesStatusComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    MatSlideToggleModule,
    CommonModule,
    MatButtonToggleModule,
    NgxChartsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
