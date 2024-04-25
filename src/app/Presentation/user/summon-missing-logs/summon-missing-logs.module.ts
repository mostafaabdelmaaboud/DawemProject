import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummonMissingLogsRoutingModule } from './summon-missing-logs-routing.module';
import { SummonMissingLogsComponent } from './summon-missing-logs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [SummonMissingLogsComponent],
  imports: [
    CommonModule,
    SummonMissingLogsRoutingModule,
    MatDialogModule,
    MatRadioModule,
    SharedModule
  ]
})
export class SummonMissingLogsModule { }
