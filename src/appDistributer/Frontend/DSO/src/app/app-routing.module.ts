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
    component: SignupComponent,
  },
  {
    path: 'signupWorker',
    component: SignupWorkerComponent,
  },
  {
    path: 'users',
    component: StranaUsersComponent,
  },
  {
    path: 'users/tabela',
    component: UsersComponent,
  },
  {
    path: 'users/tabela',
    component: UsersComponent,
  },
  {
    path: 'users/mapa',
    component: UsersComponent,
  },
  {
    path: 'employees',
    component: EmployeesComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'employeedetails',
    component: EmployeedetailsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
