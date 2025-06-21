import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OvertimeTypeRoutingModule } from './overtime-type-routing.module';
import { OvertimeTypeComponent } from './overtime-type.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    OvertimeTypeComponent
  ],
  imports: [
    CommonModule,
    OvertimeTypeRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class OvertimeTypeModule { }
