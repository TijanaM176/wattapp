import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';


import { LoginComponent } from './components/login/login.component';
import { SignupWorkerComponent } from './components/signup-worker/signup-worker.component';

import { SignupComponent } from './components/signup/signup.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component:SignupComponent,
  },
  {
    path: 'signupWorker',
    component:SignupWorkerComponent,
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
