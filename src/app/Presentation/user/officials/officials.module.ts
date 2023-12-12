import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficialsRoutingModule } from './officials-routing.module';
import { OfficialsComponent } from './officials.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    OfficialsComponent
  ],
  imports: [
    CommonModule,
    OfficialsRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class OfficialsModule { }
