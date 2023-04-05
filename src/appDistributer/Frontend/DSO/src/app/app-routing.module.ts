import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupWorkerComponent } from './components/signup-worker/signup-worker.component';

import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/Home/Home.component';
import { UsersComponent } from './components/users/users.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { MapComponent } from './components/map/map.component';
import { StranaUsersComponent } from './components/stranaUsers/stranaUsers.component';
import { EmployeedetailsComponent } from './components/employeedetails/employeedetails.component';
import { SidebarDsoComponent } from './components/sidebar-dso/sidebar-dso.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { ProsumerinfoComponent } from './components/prosumerinfo/prosumerinfo.component';
import { AddProsumerComponent } from './components/AddProsumer/AddProsumer.component';
import { TabelaUredjajaComponent } from './components/tabelaUredjaja/tabelaUredjaja.component';
import { UserDevicesComponent } from './components/UserDevices/UserDevices.component';
import { SignupWorkerPageComponent } from './components/signup-worker-page/signup-worker-page.component';

import { SidebarPotrosnjaComponent } from './components/sidebar-potrosnja/sidebar-potrosnja.component';
import { UserComponent } from './components/user/user.component';
import { DeviceinfoComponent } from './components/deviceinfo/deviceinfo.component';
import { HistoryProsumerComponent } from './components/Charts/history-Prosumer/history-Prosumer.component';
import { WorkerProfileComponent } from './components/worker-profile/worker-profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '',redirectTo:'home',pathMatch:'full'},
      { path:'home', component:HomeComponent },
      { path: 'map', component:MapComponent},
      { path:'users', component: StranaUsersComponent},
      { path: 'signup', component: AddProsumerComponent },
      { path: 'employees', component: EmployeedetailsComponent },
      { path: 'signupWorker', component: SignupWorkerPageComponent },
      { path: 'user/:id', component: UserComponent},
      { path: 'user/:id/Devices', component: UserDevicesComponent},
      { path: 'user/:id/Devices/deviceinfo/:idDev', component: DeviceinfoComponent },
      { path: 'profile', component: WorkerProfileComponent}
    ]
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
