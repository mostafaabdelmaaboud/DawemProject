import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JustificationsTypeComponent } from './justifications-type.component';

const routes: Routes = [
  { path: "", component: JustificationsTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JustificationsTypeRoutingModule { }
