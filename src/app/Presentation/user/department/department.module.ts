import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmploymentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    EmploymentRoutingModule,
    MatDialogModule,
    TranslateModule,
    InputSwitchModule,
    SharedModule
  ]
})
export class DepartmentModule { }
