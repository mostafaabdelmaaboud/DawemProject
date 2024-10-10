import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JustificationTypeDefaultRoutingModule } from './justification-type-default-routing.module';
import { JustificationTypeDefaultComponent } from './justification-type-default.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    JustificationTypeDefaultComponent
  ],
  imports: [
    CommonModule,
    JustificationTypeDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class JustificationTypeDefaultModule { }
