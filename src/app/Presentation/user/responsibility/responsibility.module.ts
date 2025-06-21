import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsibilityRoutingModule } from './responsibility-routing.module';
import { ResponsibilityComponent } from './responsibility.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ResponsibilityComponent
  ],
  imports: [
    CommonModule,
    ResponsibilityRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class ResponsibilityModule { }
