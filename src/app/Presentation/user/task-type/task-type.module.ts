import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskTypeRoutingModule } from './task-type-routing.module';
import { TaskTypeComponent } from './task-type.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TaskTypeComponent
  ],
  imports: [
    CommonModule,
    TaskTypeRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class TaskTypeModule { }
