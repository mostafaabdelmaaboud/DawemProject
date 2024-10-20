import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FingerprintDeviceManagementRoutingModule } from './fingerprint-device-management-routing.module';
import { FingerprintDeviceManagementComponent } from './fingerprint-device-management.component';


@NgModule({
  declarations: [
    FingerprintDeviceManagementComponent
  ],
  imports: [
    CommonModule,
    FingerprintDeviceManagementRoutingModule
  ]
})
export class FingerprintDeviceManagementModule { }
