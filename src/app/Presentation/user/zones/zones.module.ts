import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonesRoutingModule } from './zones-routing.module';
import { ZonesComponent } from './zones.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ZonesComponent
  ],
  imports: [
    CommonModule,
    ZonesRoutingModule,
    HttpClientModule,
    MatDialogModule,
    InputSwitchModule,
    MatRadioModule,
    TranslateModule,

    SharedModule
  ]
})
export class ZonesModule { }
