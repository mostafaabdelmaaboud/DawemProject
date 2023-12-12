import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JustificationsRoutingModule } from './justifications-routing.module';
import { JustificationsComponent } from './justifications.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    JustificationsComponent
  ],
  imports: [
    CommonModule,
    JustificationsRoutingModule,
    MatDialogModule,
    MatRadioModule,
    SharedModule
  ]
})
export class JustificationsModule { }
