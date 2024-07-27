import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BriefingSummonsInPeriodReportComponent } from './briefing-summons-in-period-report.component';

const routes: Routes = [
  {path:"", component: BriefingSummonsInPeriodReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BriefingSummonsInPeriodReportRoutingModule { }
