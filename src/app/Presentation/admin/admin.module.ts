import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { SideNavBarComponent } from 'src/app/layout/side-nav-bar/side-nav-bar.component';
import { PermissionGuard } from 'src/app/core/guard/permission.guard';

const routes: Routes = [
  {
    path: '', component: SideNavBarComponent,
    children: [
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      //   canActivate: [PermissionGuard]
      // },

    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),

  ]
})
export class AdminModule { }
