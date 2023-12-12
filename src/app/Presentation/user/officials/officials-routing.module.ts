import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficialsComponent } from './officials.component';

const routes: Routes = [
  { path: "", component: OfficialsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficialsRoutingModule { }
