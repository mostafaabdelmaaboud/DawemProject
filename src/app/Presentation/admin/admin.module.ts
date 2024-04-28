import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { SideNavBarAdminComponent } from 'src/app/layout/side-nav-bar-admin/side-nav-bar-admin.component';
import { PermissionAminGuard } from 'src/app/core/guard/permission-admin.guard';

const routes: Routes = [
  {
    path: '', component: SideNavBarAdminComponent,
    children: [
      {
        path: 'dashboard',
        // loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [PermissionAminGuard]
      },

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
