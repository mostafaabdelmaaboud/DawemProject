import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftTypeDefaultRoutingModule } from './shift-type-default-routing.module';
import { ShiftTypeDefaultComponent } from './shift-type-default.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ShiftTypeDefaultComponent
  ],
  imports: [
    CommonModule,
    ShiftTypeDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class ShiftTypeDefaultModule { }
