import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftTypeDefaultComponent } from './shift-type-default.component';

const routes: Routes = [
  {path:"",component:ShiftTypeDefaultComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftTypeDefaultRoutingModule { }
