import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendaceLeaveSummaryReportComponent } from './attendace-leave-summary-report.component';

const routes: Routes = [
  {path:"", component:AttendaceLeaveSummaryReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendaceLeaveSummaryReportRoutingModule { }
