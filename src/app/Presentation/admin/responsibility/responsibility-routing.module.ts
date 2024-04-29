import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsibilityComponent } from './responsibility.component';

const routes: Routes = [
  {path:"", component:ResponsibilityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsibilityRoutingModule { }
