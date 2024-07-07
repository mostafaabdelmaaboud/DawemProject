import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelayReportsComponent } from './delay-reports.component';

const routes: Routes = [
  {path:"", component:DelayReportsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelayReportsRoutingModule { }
