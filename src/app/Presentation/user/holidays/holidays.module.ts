import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HolidaysRoutingModule } from './holidays-routing.module';
import { HolidaysComponent } from './holidays.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    HolidaysComponent
  ],
  imports: [
    CommonModule,
    HolidaysRoutingModule,
    MatDialogModule,
    InputSwitchModule,
    TranslateModule,
    SharedModule
  ]
})
export class HolidaysModule { }
