import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummonMissingLogsComponent } from './summon-missing-logs.component';

const routes: Routes = [
  {path:"", component:SummonMissingLogsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummonMissingLogsRoutingModule { }
