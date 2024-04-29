import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsibilityRoutingModule } from './responsibility-routing.module';
import { ResponsibilityComponent } from './responsibility.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ResponsibilityComponent
  ],
  imports: [
    CommonModule,
    ResponsibilityRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class ResponsibilityModule { }
