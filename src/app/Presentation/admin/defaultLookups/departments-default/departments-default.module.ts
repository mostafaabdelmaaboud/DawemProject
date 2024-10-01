import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentsDefaultRoutingModule } from './departments-default-routing.module';
import { DepartmentsDefaultComponent } from './departments-default.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DepartmentsDefaultComponent
  ],
  imports: [
    CommonModule,
    DepartmentsDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class DepartmentsDefaultModule { }
