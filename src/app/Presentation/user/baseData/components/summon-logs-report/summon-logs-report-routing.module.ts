import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummonLogsReportComponent } from './summon-logs-report.component';

const routes: Routes = [
  {path:"", component:SummonLogsReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummonLogsReportRoutingModule { }
