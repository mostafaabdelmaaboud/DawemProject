import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationBalanceRoutingModule } from './vacation-balance-routing.module';
import { VacationBalanceComponent } from './vacation-balance.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    VacationBalanceComponent
  ],
  imports: [
    CommonModule,
    VacationBalanceRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class VacationBalanceModule { }
