import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskTypeComponent } from './task-type.component';

const routes: Routes = [
  { path: "", component: TaskTypeComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskTypeRoutingModule { }
