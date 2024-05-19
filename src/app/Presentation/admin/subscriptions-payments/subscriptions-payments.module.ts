import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionsPaymentsRoutingModule } from './subscriptions-payments-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubscriptionsPaymentsComponent } from './subscriptions-payments.component';


@NgModule({
  declarations: [
    SubscriptionsPaymentsComponent
  ],
  imports: [
    CommonModule,
    SubscriptionsPaymentsRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class SubscriptionsPaymentsModule { }
