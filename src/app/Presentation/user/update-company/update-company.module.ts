import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateCompanyRoutingModule } from './update-company-routing.module';
import { UpdateCompanyComponent } from './update-company.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    UpdateCompanyComponent
  ],
  imports: [
    CommonModule,
    UpdateCompanyRoutingModule,
    TranslateModule,
    MatRadioModule,
    DropdownModule,
    SharedModule,
    MatDialogModule
  ]
})
export class UpdateCompanyModule { }
