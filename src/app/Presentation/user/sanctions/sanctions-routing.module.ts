import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanctionsComponent } from './sanctions.component';

const routes: Routes = [
  {path:"", component:SanctionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanctionsRoutingModule { }
