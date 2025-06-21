import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OvertimeRequestComponent } from './overtime-request.component';

const routes: Routes = [
    { path: "", component: OvertimeRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OvertimeRequestRoutingModule { }
