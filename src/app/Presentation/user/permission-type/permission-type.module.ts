import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionTypeRoutingModule } from './permission-type-routing.module';
import { PermissionTypeComponent } from './permission-type.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PermissionTypeComponent
  ],
  imports: [
    CommonModule,
    PermissionTypeRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class PermissionTypeModule { }
