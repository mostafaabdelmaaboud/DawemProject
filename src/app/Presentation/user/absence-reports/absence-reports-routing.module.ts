import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbsenceReportsComponent } from './absence-reports.component';

const routes: Routes = [
  {path:"", component:AbsenceReportsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbsenceReportsRoutingModule { }
