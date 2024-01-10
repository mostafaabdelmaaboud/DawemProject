import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPermissionsComponent } from './user-permissions.component';

const routes: Routes = [
  { path: "", component: UserPermissionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPermissionsRoutingModule { }
