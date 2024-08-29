import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceAndDepartureForEmployeesComponent } from './attendance-and-departure-for-employees.component';

const routes: Routes = [
{path:"", component:AttendanceAndDepartureForEmployeesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceAndDepartureForEmployeesRoutingModule { }
