import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OvertimeTypeComponent } from './overtime-type.component';

const routes: Routes = [
    { path: "", component: OvertimeTypeComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OvertimeTypeRoutingModule { }
