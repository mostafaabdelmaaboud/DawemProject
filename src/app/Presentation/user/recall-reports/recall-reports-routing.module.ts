import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecallReportsComponent } from './recall-reports.component';

const routes: Routes = [
  {path:"", component:RecallReportsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecallReportsRoutingModule { }
