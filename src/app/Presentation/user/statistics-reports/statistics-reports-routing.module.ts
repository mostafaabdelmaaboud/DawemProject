import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsReportsComponent } from './statistics-reports.component';

const routes: Routes = [
  {path:"", component:StatisticsReportsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsReportsRoutingModule { }
