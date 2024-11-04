import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionsRoutingModule } from './sections-routing.module';
import { SectionsComponent } from './sections.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    SectionsComponent
  ],
  imports: [
    CommonModule,
    SectionsRoutingModule,
    MatDialogModule,
    TranslateModule,
    SharedModule
  ]
})
export class SectionsModule { }
