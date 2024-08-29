import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummonsReportComponent } from './summons-report.component';

const routes: Routes = [
  {path:"",component:SummonsReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummonsReportRoutingModule { }
