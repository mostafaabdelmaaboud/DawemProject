import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenGroupsComponent } from './screen-groups.component';

const routes: Routes = [
  {path:"", component:ScreenGroupsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreenGroupsRoutingModule { }
