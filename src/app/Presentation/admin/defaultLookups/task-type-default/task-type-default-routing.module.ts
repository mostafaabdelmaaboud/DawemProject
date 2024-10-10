import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskTypeDefaultComponent } from './task-type-default.component';

const routes: Routes = [
  {path:"", component:TaskTypeDefaultComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskTypeDefaultRoutingModule { }
