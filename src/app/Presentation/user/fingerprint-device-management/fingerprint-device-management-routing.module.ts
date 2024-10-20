import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FingerprintDeviceManagementComponent } from './fingerprint-device-management.component';

const routes: Routes = [
  {path:"", component: FingerprintDeviceManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FingerprintDeviceManagementRoutingModule { }
