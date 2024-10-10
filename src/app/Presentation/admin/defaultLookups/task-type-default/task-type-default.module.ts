import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskTypeDefaultRoutingModule } from './task-type-default-routing.module';
import { TaskTypeDefaultComponent } from './task-type-default.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TaskTypeDefaultComponent
  ],
  imports: [
    CommonModule,
    TaskTypeDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class TaskTypeDefaultModule { }
