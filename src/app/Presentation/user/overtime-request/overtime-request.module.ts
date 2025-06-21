import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OvertimeRequestRoutingModule } from './overtime-request-routing.module';
import { OvertimeRequestComponent } from './overtime-request.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    OvertimeRequestComponent
  ],
  imports: [
    CommonModule,
    OvertimeRequestRoutingModule,
        MatDialogModule,
        TranslateModule,
        MatRadioModule,
        SharedModule
  ]
})
export class OvertimeRequestModule { }
