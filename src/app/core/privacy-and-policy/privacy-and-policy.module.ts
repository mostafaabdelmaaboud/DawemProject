import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyAndPolicyRoutingModule } from './privacy-and-policy-routing.module';
import { PrivacyAndPolicyComponent } from './privacy-and-policy.component';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PrivacyAndPolicyComponent
  ],
  imports: [
    CommonModule,
    PrivacyAndPolicyRoutingModule,
    FormsModule,
    NgbDropdownModule,
    TranslateModule,
    DropdownModule,
    SharedModule
  ]
})
export class PrivacyAndPolicyModule { }
