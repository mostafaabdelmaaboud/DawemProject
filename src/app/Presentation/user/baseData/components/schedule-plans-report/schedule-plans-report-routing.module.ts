import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulePlansReportComponent } from './schedule-plans-report.component';

const routes: Routes = [
  {path:"", component:SchedulePlansReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulePlansReportRoutingModule { }
