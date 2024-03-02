import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleLogsRoutingModule } from './schedule-logs-routing.module';
import { ScheduleLogsComponent } from './schedule-logs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ScheduleLogsComponent],
  imports: [
    CommonModule,
    ScheduleLogsRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class ScheduleLogsModule { }
