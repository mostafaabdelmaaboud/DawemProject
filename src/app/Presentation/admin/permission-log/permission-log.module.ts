import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionLogRoutingModule } from './permission-log-routing.module';
import { PermissionLogComponent } from './permission-log.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PermissionLogComponent
  ],
  imports: [
    CommonModule,
    PermissionLogRoutingModule,
    MatDialogModule,
    MatRadioModule,
    TranslateModule,
    SharedModule
  ]
})
export class PermissionLogModule { }
