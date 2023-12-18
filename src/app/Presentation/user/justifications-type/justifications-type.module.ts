import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JustificationsTypeRoutingModule } from './justifications-type-routing.module';
import { JustificationsTypeComponent } from './justifications-type.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    JustificationsTypeComponent
  ],
  imports: [
    CommonModule,
    JustificationsTypeRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class JustificationsTypeModule { }
