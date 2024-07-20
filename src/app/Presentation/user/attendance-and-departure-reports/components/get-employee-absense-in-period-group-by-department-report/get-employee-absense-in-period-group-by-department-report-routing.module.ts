import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetEmployeeAbsenseInPeriodGroupByDepartmentReportComponent } from './get-employee-absense-in-period-group-by-department-report.component';

const routes: Routes = [
  {  path:"", component:GetEmployeeAbsenseInPeriodGroupByDepartmentReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetEmployeeAbsenseInPeriodGroupByDepartmentReportRoutingModule { }
