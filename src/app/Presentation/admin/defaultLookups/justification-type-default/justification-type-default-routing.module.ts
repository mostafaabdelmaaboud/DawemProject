import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JustificationTypeDefaultComponent } from './justification-type-default.component';

const routes: Routes = [
  {path:"", component:JustificationTypeDefaultComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JustificationTypeDefaultRoutingModule { }
