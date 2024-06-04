import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScreensRoutingModule } from './screens-routing.module';
import { ScreensComponent } from './screens.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ScreensComponent
  ],
  imports: [
    CommonModule,
    ScreensRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class ScreensModule { }
