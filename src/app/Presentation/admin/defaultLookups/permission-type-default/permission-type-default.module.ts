import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionTypeDefaultRoutingModule } from './permission-type-default-routing.module';
import { PermissionTypeDefaultComponent } from './permission-type-default.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PermissionTypeDefaultComponent
  ],
  imports: [
    CommonModule,
    PermissionTypeDefaultRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class PermissionTypeDefaultModule { }
