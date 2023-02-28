import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {WorkersComponent} from './workers/workers.component';

const routes: Routes = [
  {path: 'employee', component:WorkersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
