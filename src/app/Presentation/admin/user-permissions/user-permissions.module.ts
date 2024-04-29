import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPermissionsRoutingModule } from './user-permissions-routing.module';
import { UserPermissionsComponent } from './user-permissions.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    UserPermissionsComponent
  ],
  imports: [
    CommonModule,
    UserPermissionsRoutingModule,
    TranslateModule,
    MatDialogModule,
    SharedModule
  ]
})
export class UserPermissionsModule { }
