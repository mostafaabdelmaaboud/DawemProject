import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTitlesRoutingModule } from './job-titles-routing.module';
import { JobTitlesComponent } from './job-titles.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    JobTitlesComponent
  ],
  imports: [
    CommonModule,
    JobTitlesRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class JobTitlesModule { }
