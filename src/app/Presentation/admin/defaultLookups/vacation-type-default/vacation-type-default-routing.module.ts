import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacationTypeDefaultComponent } from './vacation-type-default.component';

const routes: Routes = [{
  path:"", component:VacationTypeDefaultComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationTypeDefaultRoutingModule { }
