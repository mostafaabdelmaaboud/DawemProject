import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionTypeDefaultComponent } from './permission-type-default.component';

const routes: Routes = [
  {path:"", component:PermissionTypeDefaultComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionTypeDefaultRoutingModule { }
