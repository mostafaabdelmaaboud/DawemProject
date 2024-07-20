import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LateEarlyArrivalGroupByEmployeeComponent } from './late-early-arrival-group-by-employee.component';

const routes: Routes = [
  {path:"", component:LateEarlyArrivalGroupByEmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LateEarlyArrivalGroupByEmployeeRoutingModule { }
