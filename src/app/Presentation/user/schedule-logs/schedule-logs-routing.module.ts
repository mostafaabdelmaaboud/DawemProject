import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleLogsComponent } from './schedule-logs.component';

const routes: Routes = [
  { path: "", component: ScheduleLogsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleLogsRoutingModule { }
