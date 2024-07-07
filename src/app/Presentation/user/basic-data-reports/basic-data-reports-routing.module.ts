import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicDataReportsComponent } from './basic-data-reports.component';

const routes: Routes = [
  {path:"", component:BasicDataReportsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicDataReportsRoutingModule { }
