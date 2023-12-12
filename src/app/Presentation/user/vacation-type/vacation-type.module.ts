import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationTypeRoutingModule } from './vacation-type-routing.module';
import { VacationTypeComponent } from './vacation-type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    VacationTypeComponent
  ],
  imports: [
    CommonModule,
    VacationTypeRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class VacationTypeModule { }
