import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationTypeDefaultRoutingModule } from './vacation-type-default-routing.module';
import { VacationTypeDefaultComponent } from './vacation-type-default.component';

import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    VacationTypeDefaultComponent
  ],
  imports: [
    CommonModule,
    VacationTypeDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class VacationTypeDefaultModule { }
