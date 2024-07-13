import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryOfAttendanceAndDepartureReportComponent } from './summary-of-attendance-and-departure-report.component';

const routes: Routes = [
  {path:"", component:SummaryOfAttendanceAndDepartureReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryOfAttendanceAndDepartureReportRoutingModule { }
