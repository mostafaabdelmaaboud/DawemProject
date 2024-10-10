import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PenaltiesDefaultRoutingModule } from './penalties-default-routing.module';
import { PenaltiesDefaultComponent } from './penalties-default.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PenaltiesDefaultComponent
  ],
  imports: [
    CommonModule,
    PenaltiesDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class PenaltiesDefaultModule { }
