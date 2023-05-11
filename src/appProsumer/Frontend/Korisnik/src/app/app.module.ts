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
import { PredictionChartComponent } from './components/Charts/prediction-chart/prediction-chart.component';
import { HouseComponent } from './components/Charts/house/house.component';
import { DevicesStatusComponent } from './components/Charts/devices-status/devices-status.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConsumptionLimitComponent } from './components/Charts/consumption-limit/consumption-limit.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { ToastrModule } from 'ngx-toastr';
import { RealizationDeviceComponent } from './components/Charts/realizationDevice/realizationDevice.component';
import { PredictionDeviceComponent } from './components/Charts/predictionDevice/predictionDevice.component';
import { RealizationChartTableComponent } from './components/Charts-tables/realization-chart-table/realization-chart-table.component';
import { PredictionChartTableComponent } from './components/Charts-tables/prediction-chart-table/prediction-chart-table.component';
import { RealizationDeviceTableComponent } from './components/Charts-tables/realization-device-table/realization-device-table.component';
import { PredictionDeviceTableComponent } from './components/Charts-tables/prediction-device-table/prediction-device-table.component';
import { RealizationChartProductionComponent } from './components/Charts/realization-chart-production/realization-chart-production.component';
import { ImageCropperModule } from 'ngx-image-cropper';

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
    ConsumptionLimitComponent,
    RealizationDeviceComponent,
    PredictionDeviceComponent,
    RealizationChartTableComponent,
    PredictionChartTableComponent,
    RealizationDeviceTableComponent,
    PredictionDeviceTableComponent,
    RealizationChartProductionComponent,
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
    NgxSpinnerModule,
    NgxGaugeModule,
    ToastrModule.forRoot(),
    ImageCropperModule,
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
