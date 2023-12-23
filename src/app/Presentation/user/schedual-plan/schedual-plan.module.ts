import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedualPlanRoutingModule } from './schedual-plan-routing.module';
import { SchedualPlanComponent } from './schedual-plan.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SchedualPlanComponent],
  imports: [
    CommonModule,
    SchedualPlanRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class SchedualPlanModule { }
