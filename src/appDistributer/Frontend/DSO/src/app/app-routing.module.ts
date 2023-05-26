import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './components/login/login.component';

import { HomeComponent } from './components/Home/Home.component';
import { MapComponent } from './components/map/map.component';
import { StranaUsersComponent } from './components/stranaUsers/stranaUsers.component';
import { EmployeedetailsComponent } from './components/employeedetails/employeedetails.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { AddProsumerComponent } from './components/AddProsumer/AddProsumer.component';
import { UserDevicesComponent } from './components/UserDevices/UserDevices.component';
import { SignupWorkerPageComponent } from './components/signup-worker-page/signup-worker-page.component';

import { UserComponent } from './components/user/user.component';
import { DeviceinfoComponent } from './components/deviceinfo/deviceinfo.component';
import { WorkerProfileComponent } from './components/worker-profile/worker-profile.component';
import { User1Component } from './components/user1/user1.component';

const routes: Routes = [
  { path: 'login', 
    component: LoginComponent,
    canActivate: [LoginGuard] 
  },
  { path: '', redirectTo: 'DsoApp', pathMatch: 'full' },
  {
    path: 'DsoApp',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'map', component: MapComponent },
      { path: 'users', component: StranaUsersComponent },
      { path: 'signup', component: AddProsumerComponent },
      { path: 'employees', component: EmployeedetailsComponent },
      { path: 'signupWorker', component: SignupWorkerPageComponent },
      { path: 'user/:id', component: User1Component },
      { path: 'user/:id/Devices', component: UserDevicesComponent },
      { path: 'user/:id/Devices/deviceinfo/:idDev', component: DeviceinfoComponent },
      { path: 'profile', component: WorkerProfileComponent },
      { path: 'editProsumer/:id', component: UserComponent}
    ],
  },
  {
    path: 'resetpassword',
    component: ResetpasswordComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
