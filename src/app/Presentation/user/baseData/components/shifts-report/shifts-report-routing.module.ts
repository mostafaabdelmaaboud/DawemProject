import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftsReportComponent } from './shifts-report.component';

const routes: Routes = [
  {path:"",component:ShiftsReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftsReportRoutingModule { }
