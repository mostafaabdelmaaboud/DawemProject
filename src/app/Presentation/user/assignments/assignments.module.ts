import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentsRoutingModule } from './assignments-routing.module';
import { AssignmentsComponent } from './assignments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AssignmentsComponent
  ],
  imports: [
    CommonModule,
    AssignmentsRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class AssignmentsModule { }
