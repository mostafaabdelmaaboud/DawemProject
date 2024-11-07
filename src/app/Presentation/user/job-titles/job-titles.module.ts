import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTitlesRoutingModule } from './job-titles-routing.module';
import { JobTitlesComponent } from './job-titles.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    JobTitlesComponent
  ],
  imports: [
    CommonModule,
    JobTitlesRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class JobTitlesModule { }
