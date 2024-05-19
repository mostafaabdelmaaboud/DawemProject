import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionsPaymentsComponent } from './subscriptions-payments.component';

const routes: Routes = [
  {path:"", component:SubscriptionsPaymentsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsPaymentsRoutingModule { }
