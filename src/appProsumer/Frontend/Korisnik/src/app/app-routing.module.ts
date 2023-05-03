import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PocetnaComponent } from './components/Pocetna/Pocetna.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { DeviceinfoComponent } from './components/deviceinfo/deviceinfo.component';
import { UserDevicesComponent } from './components/userDevices/userDevices.component';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, 
  canActivate: [LoginGuard] 
  },
  { path: '', redirectTo: 'ProsumerApp', pathMatch: 'full' },
  {
    path: 'ProsumerApp',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: PocetnaComponent },
      { path: 'userInfo', component: UserInfoComponent },
      { path: 'userDevices', component: UserDevicesComponent },
      { path: 'userDevices/:idDev/deviceinfo', component: DeviceinfoComponent },
      { path: 'addDevice', component: AddDeviceComponent },
    ],
  },
  { path: 'resetpassword', component: ResetpasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
