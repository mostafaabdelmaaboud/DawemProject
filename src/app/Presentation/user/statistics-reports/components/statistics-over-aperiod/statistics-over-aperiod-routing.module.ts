import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsOverAperiodComponent } from './statistics-over-aperiod.component';

const routes: Routes = [
  {path:'', component:StatisticsOverAperiodComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsOverAperiodRoutingModule { }
