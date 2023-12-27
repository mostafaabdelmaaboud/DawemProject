import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FingerPrintDevicesComponent } from './finger-print-devices.component';

const routes: Routes = [
  { path: "", component: FingerPrintDevicesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FingerPrintDevicesRoutingModule { }
