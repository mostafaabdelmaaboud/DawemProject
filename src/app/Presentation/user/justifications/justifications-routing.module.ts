import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JustificationsComponent } from './justifications.component';

const routes: Routes = [
  { path: "", component: JustificationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JustificationsRoutingModule { }
