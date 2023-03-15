import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';


import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';
import { SignupWorkerComponent } from './components/signupWorker/signupWorker.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'singup',
    component:SingupComponent,
  },
  {
    path: 'signupWorker',
    component: SignupWorkerComponent,
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
