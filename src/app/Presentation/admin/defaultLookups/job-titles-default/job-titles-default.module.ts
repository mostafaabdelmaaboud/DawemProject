import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTitlesDefaultRoutingModule } from './job-titles-default-routing.module';
import { JobTitlesDefaultComponent } from './job-titles-default.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    JobTitlesDefaultComponent
  ],
  imports: [
    CommonModule,
    JobTitlesDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class JobTitlesDefaultModule { }
