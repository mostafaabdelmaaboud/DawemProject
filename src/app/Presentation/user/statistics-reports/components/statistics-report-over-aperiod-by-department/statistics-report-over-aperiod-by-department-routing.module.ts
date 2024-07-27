import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsReportOverAperiodByDepartmentComponent } from './statistics-report-over-aperiod-by-department.component';

const routes: Routes = [
  {path:"", component:StatisticsReportOverAperiodByDepartmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsReportOverAperiodByDepartmentRoutingModule { }
