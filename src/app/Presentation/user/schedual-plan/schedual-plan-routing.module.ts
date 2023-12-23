import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedualPlanComponent } from './schedual-plan.component';

const routes: Routes = [
  { path: "", component: SchedualPlanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedualPlanRoutingModule { }
