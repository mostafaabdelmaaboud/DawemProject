import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EarlyAndLateAttendanceComponent } from './early-and-late-attendance.component';

const routes: Routes = [
  {path:"", component:EarlyAndLateAttendanceComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarlyAndLateAttendanceRoutingModule { }
