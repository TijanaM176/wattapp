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

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: AddProsumerComponent,
  },
  {
    path: 'signupWorker',
    component: SignupWorkerPageComponent,
  },
  {
    path: 'users',
    component: StranaUsersComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/tabela',
    component: StranaUsersComponent,
  },

  {
    path: 'users/mapa',
    component: MapComponent,
  },
  {
    path: 'employees',
    component: EmployeesComponent,
  },
  {
    path: 'employeedetails',
    component: EmployeedetailsComponent,
  },
  {
    path: 'sidebardso',
    component: SidebarDsoComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'resetpassword',
    component: ResetpasswordComponent,
  },
  {
    path: 'prosumerinfo',
    component: ProsumerinfoComponent,
  },
  {
    path: 'prosumerDevices',
    component: UserDevicesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
