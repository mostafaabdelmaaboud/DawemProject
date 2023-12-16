import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionTypeComponent } from './permission-type.component';

const routes: Routes = [
  { path: "", component: PermissionTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionTypeRoutingModule { }
