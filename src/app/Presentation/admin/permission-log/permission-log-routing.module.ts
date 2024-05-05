import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionLogComponent } from './permission-log.component';

const routes: Routes = [
  {path:"", component:PermissionLogComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionLogRoutingModule { }
