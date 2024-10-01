import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsDefaultComponent } from './departments-default.component';

const routes: Routes = [
  {path:"", component:DepartmentsDefaultComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentsDefaultRoutingModule { }
