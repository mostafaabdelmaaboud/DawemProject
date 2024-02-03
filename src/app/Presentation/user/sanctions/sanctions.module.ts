import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanctionsRoutingModule } from './sanctions-routing.module';
import { SanctionsComponent } from './sanctions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    SanctionsComponent
  ],
  imports: [
    CommonModule,
    SanctionsRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class SanctionsModule { }
