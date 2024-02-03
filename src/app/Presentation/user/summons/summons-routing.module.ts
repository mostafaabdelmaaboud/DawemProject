import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummonsComponent } from './summons.component';

const routes: Routes = [
  {path:"", component:SummonsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummonsRoutingModule { }
