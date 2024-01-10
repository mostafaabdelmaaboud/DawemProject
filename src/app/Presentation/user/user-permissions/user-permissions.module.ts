import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPermissionsRoutingModule } from './user-permissions-routing.module';
import { UserPermissionsComponent } from './user-permissions.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    UserPermissionsComponent
  ],
  imports: [
    CommonModule,
    UserPermissionsRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class UserPermissionsModule { }
