import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsReportOverAperiodGroupByMonthComponent } from './statistics-report-over-aperiod-group-by-month.component';

const routes: Routes = [
  {path:"", component:StatisticsReportOverAperiodGroupByMonthComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsReportOverAperiodGroupByMonthRoutingModule { }
