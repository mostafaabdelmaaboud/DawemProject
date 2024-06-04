import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScreenGroupsRoutingModule } from './screen-groups-routing.module';
import { ScreenGroupsComponent } from './screen-groups.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    ScreenGroupsComponent
  ],
  imports: [
    CommonModule,
    ScreenGroupsRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class ScreenGroupsModule { }
