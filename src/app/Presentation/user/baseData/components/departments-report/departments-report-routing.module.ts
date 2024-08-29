import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsReportComponent } from './departments-report.component';

const routes: Routes = [
  {path:"", component:DepartmentsReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentsReportRoutingModule { }
