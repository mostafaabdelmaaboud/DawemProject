import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyAndPolicyComponent } from './privacy-and-policy.component';

const routes: Routes = [
  {path:"", component:PrivacyAndPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyAndPolicyRoutingModule { }
