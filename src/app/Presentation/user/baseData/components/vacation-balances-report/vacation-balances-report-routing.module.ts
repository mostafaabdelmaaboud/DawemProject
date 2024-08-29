import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacationBalancesReportComponent } from './vacation-balances-report.component';

const routes: Routes = [
  {path:"", component:VacationBalancesReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationBalancesReportRoutingModule { }
