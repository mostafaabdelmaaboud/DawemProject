import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficialHolidayDefaultComponent } from './official-holiday-default.component';

const routes: Routes = [
  {path:"", component:OfficialHolidayDefaultComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficialHolidayDefaultRoutingModule { }
