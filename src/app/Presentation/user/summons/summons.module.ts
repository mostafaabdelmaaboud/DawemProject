import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummonsRoutingModule } from './summons-routing.module';
import { SummonsComponent } from './summons.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SummonsComponent
  ],
  imports: [
    CommonModule,
    SummonsRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class SummonsModule { }
