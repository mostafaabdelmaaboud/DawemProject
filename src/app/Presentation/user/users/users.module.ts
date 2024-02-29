import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    NgbDropdownModule,
    DropdownModule,
    TranslateModule,
    CheckboxModule,
    SharedModule
  ]
})
export class UsersModule { }
