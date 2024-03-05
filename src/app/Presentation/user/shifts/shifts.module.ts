import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftsRoutingModule } from './shifts-routing.module';
import { ShiftsComponent } from './shifts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ShiftsComponent
  ],
  imports: [
    CommonModule,
    ShiftsRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class ShiftsModule { }
