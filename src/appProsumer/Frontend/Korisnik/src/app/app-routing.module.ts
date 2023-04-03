import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { PocetnaComponent } from './components/Pocetna/Pocetna.component';
import { ResetPassword } from './models/reset-password';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { NavbarOffcanvasComponent } from './components/navbar-offcanvas/navbar-offcanvas.component';
import { SidebarResponsiveComponent } from './components/sidebar-responsive/sidebar-responsive.component';
import { DeviceinfoComponent } from './components/deviceinfo/deviceinfo.component';
import { AddDeviceComponent } from './components/add-device/add-device.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    //canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo:'pocetna', pathMatch:'full'},
      { path: 'pocetna', component: PocetnaComponent },
      { path: 'userInfo', component: UserInfoComponent },
      { path: 'deviceinfo', component: DeviceinfoComponent },
      { path: 'addDevice', component: AddDeviceComponent}
    ],
  },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'userInfo', component: UserInfoComponent },
  { path: 'navOffcanvas', component: NavbarOffcanvasComponent },
  { path: 'sidebar', component: SidebarResponsiveComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
