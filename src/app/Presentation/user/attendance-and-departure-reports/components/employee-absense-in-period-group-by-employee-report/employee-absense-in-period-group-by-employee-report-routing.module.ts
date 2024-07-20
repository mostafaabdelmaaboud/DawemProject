import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAbsenseInPeriodGroupByEmployeeReportComponent } from './employee-absense-in-period-group-by-employee-report.component';

const routes: Routes = [{
  path:"", component:EmployeeAbsenseInPeriodGroupByEmployeeReportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAbsenseInPeriodGroupByEmployeeReportRoutingModule { }
