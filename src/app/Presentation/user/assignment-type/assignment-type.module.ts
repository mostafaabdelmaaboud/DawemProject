import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentTypeRoutingModule } from './assignment-type-routing.module';
import { AssignmentTypeComponent } from './assignment-type.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AssignmentTypeComponent
  ],
  imports: [
    CommonModule,
    AssignmentTypeRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class AssignmentTypeModule { }
