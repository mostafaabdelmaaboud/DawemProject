import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentTypeComponent } from './assignment-type.component';

const routes: Routes = [
  { path: "", component: AssignmentTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentTypeRoutingModule { }
