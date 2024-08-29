import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZonesReportComponent } from './zones-report.component';

const routes: Routes = [
  {path:"",component:ZonesReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonesReportRoutingModule { }
