import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacationTypeComponent } from './vacation-type.component';

const routes: Routes = [
  { path: "", component: VacationTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationTypeRoutingModule { }
