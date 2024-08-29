import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanctionsReportComponent } from './sanctions-report.component';

const routes: Routes = [
  {path:"",component:SanctionsReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanctionsReportRoutingModule { }
