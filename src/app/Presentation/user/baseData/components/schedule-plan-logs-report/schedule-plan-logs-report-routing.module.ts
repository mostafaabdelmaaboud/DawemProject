import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulePlanLogsReportComponent } from './schedule-plan-logs-report.component';

const routes: Routes = [
  {path:"", component:SchedulePlanLogsReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulePlanLogsReportRoutingModule { }
