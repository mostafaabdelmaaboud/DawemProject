import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionTypeRoutingModule } from './permission-type-routing.module';
import { PermissionTypeComponent } from './permission-type.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PermissionTypeComponent
  ],
  imports: [
    CommonModule,
    PermissionTypeRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class PermissionTypeModule { }
