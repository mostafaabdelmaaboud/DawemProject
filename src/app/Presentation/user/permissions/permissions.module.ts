import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsComponent } from './permissions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PermissionsComponent
  ],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class PermissionsModule { }
