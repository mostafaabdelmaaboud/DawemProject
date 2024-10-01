import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficialHolidayDefaultRoutingModule } from './official-holiday-default-routing.module';
import { OfficialHolidayDefaultComponent } from './official-holiday-default.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    OfficialHolidayDefaultComponent
  ],
  imports: [
    CommonModule,
    OfficialHolidayDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class OfficialHolidayDefaultModule { }
