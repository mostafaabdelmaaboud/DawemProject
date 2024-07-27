import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummonsDetailsGroupByEmployeeComponent } from './summons-details-group-by-employee.component';

const routes: Routes = [
  {path:"", component: SummonsDetailsGroupByEmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummonsDetailsGroupByEmployeeRoutingModule { }
