import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FingerPrintDevicesRoutingModule } from './finger-print-devices-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { FingerPrintDevicesComponent } from './finger-print-devices.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [FingerPrintDevicesComponent],
  imports: [
    CommonModule,
    FingerPrintDevicesRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class FingerPrintDevicesModule { }
