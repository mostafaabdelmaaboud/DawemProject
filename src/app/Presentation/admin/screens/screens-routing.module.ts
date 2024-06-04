import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreensComponent } from './screens.component';

const routes: Routes = [
  {path:"", component: ScreensComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreensRoutingModule { }
