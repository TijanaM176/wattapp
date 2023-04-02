import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { NavBarComponent } from './components/NavBar/NavBar.component';
import { SideBarComponent } from './components/SideBar/SideBar.component';
import { PocetnaComponent } from './components/Pocetna/Pocetna.component';
import { ResetPassword } from './models/reset-password';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { NavbarOffcanvasComponent } from './components/navbar-offcanvas/navbar-offcanvas.component';
import { SidebarResponsiveComponent } from './components/sidebar-responsive/sidebar-responsive.component';
import { DeviceinfoComponent } from './components/deviceinfo/deviceinfo.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    //canActivate: [AuthGuard],
    children:[
      {path: 'deviceinfo', component: DeviceinfoComponent}
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'pocetna', component: PocetnaComponent },
  {path:'resetpassword' ,component:ResetpasswordComponent},
  {path: 'userInfo', component: UserInfoComponent},
  {path: 'navOffcanvas', component: NavbarOffcanvasComponent},
  {path: 'sidebar', component: SidebarResponsiveComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
