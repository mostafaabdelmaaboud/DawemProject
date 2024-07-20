import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverTimeInSelectedPeriodReportComponent } from './over-time-in-selected-period-report.component';

const routes: Routes = [
  {path:"", component:OverTimeInSelectedPeriodReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverTimeInSelectedPeriodReportRoutingModule { }
