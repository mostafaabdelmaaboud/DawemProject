import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    GroupsComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class GroupsModule { }
