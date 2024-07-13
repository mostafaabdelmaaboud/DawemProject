import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceAndDepartureFromDepartmentReportComponent } from './attendance-and-departure-from-department-report.component';

const routes: Routes = [
  {path:"", component:AttendanceAndDepartureFromDepartmentReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceAndDepartureFromDepartmentReportRoutingModule { }
