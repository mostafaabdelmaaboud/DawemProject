import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationsRoutingModule } from './vacations-routing.module';
import { VacationsComponent } from './vacations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    VacationsComponent
  ],
  imports: [
    CommonModule,
    VacationsRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class VacationsModule { }
