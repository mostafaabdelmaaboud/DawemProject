import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationBalanceRoutingModule } from './vacation-balance-routing.module';
import { VacationBalanceComponent } from './vacation-balance.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    VacationBalanceComponent
  ],
  imports: [
    CommonModule,
    VacationBalanceRoutingModule,
    TranslateModule,
    MatDialogModule,
    SharedModule
  ]
})
export class VacationBalanceModule { }
