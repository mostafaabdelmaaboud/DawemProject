import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PenaltiesDefaultComponent } from './penalties-default.component';

const routes: Routes = [
  {path:"",component:PenaltiesDefaultComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PenaltiesDefaultRoutingModule { }
