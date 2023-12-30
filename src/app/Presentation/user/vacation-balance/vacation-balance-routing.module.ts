import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacationBalanceComponent } from './vacation-balance.component';

const routes: Routes = [
  { path: "", component: VacationBalanceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationBalanceRoutingModule { }
