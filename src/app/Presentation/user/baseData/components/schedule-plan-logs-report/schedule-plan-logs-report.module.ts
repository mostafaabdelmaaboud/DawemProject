import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulePlanLogsReportRoutingModule } from './schedule-plan-logs-report-routing.module';
import { SchedulePlanLogsReportComponent } from './schedule-plan-logs-report.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MultiSelectModule } from 'primeng/multiselect';
import {  ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { SafeUrlPipe } from './safeUrl.pipe';

@NgModule({
  declarations: [
    SchedulePlanLogsReportComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    SchedulePlanLogsReportRoutingModule,
    HttpClientModule,
    MatDialogModule,
    TranslateModule,
    InputSwitchModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MultiSelectModule, 
    ReactiveFormsModule, 
    DropdownModule, 
    CalendarModule, 
    InputSwitchModule, 
    InputTextModule,
    SharedModule
  ]
})
export class SchedulePlanLogsReportModule { }
