import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    TableModule,
    PaginatorModule,
    NgbAccordionModule,
    CheckboxModule,
    OverlayPanelModule,
    NgxPaginationModule,
    MatProgressSpinnerModule

  ],
  exports: [
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    TableModule,
    PaginatorModule,
    NgbAccordionModule,
    CheckboxModule,
    OverlayPanelModule,
    NgxPaginationModule,
    MatProgressSpinnerModule

  ]
})
export class SharedModule { }
