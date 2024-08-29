import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsReportComponent } from './groups-report.component';

const routes: Routes = [
  {path:"",component:GroupsReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsReportRoutingModule { }
