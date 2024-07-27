import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummonsDetailsInPeriodRoutingModule } from './summons-details-in-period-routing.module';
import { SummonsDetailsInPeriodComponent } from './summons-details-in-period.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SafeUrlPipe } from './safeUrl.pipe';


@NgModule({
  declarations: [
    SummonsDetailsInPeriodComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    SummonsDetailsInPeriodRoutingModule,
    HttpClientModule,
    MatDialogModule,
    TranslateModule,
    InputSwitchModule,
    MatRadioModule,
    RadioButtonModule,
    MatProgressSpinnerModule,
    MultiSelectModule, 
    ReactiveFormsModule, 
    DropdownModule, 
    CalendarModule, 
    InputSwitchModule, 
    InputTextModule,
    SharedModule
  ]
})
export class SummonsDetailsInPeriodModule { }
