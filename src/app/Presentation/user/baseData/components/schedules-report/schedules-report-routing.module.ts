import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulesReportComponent } from './schedules-report.component';

const routes: Routes = [
  {path:"", component:SchedulesReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesReportRoutingModule { }
