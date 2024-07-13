import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceAndDepartureDetailsComponent } from './attendance-and-departure-details.component';

const routes: Routes = [
  {path:"", component:AttendanceAndDepartureDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceAndDepartureDetailsRoutingModule { }
