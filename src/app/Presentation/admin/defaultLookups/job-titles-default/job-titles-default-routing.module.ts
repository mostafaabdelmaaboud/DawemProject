import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobTitlesDefaultComponent } from './job-titles-default.component';

const routes: Routes = [
  {path:"", component:JobTitlesDefaultComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobTitlesDefaultRoutingModule { }
