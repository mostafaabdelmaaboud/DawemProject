import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationsRoutingModule } from './vacations-routing.module';
import { VacationsComponent } from './vacations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    VacationsComponent
  ],
  imports: [
    CommonModule,
    VacationsRoutingModule,
    MatDialogModule,
    TranslateModule,

    SharedModule
  ]
})
export class VacationsModule { }
