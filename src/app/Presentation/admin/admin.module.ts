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
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      //   canActivate: [PermissionAminGuard]
      // },
      {
        path: "responsibility",
        loadChildren: () => import('./responsibility/responsibility.module').then((m) => m.ResponsibilityModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "userPermissions",
        loadChildren: () => import('./user-permissions/user-permissions.module').then((m) => m.UserPermissionsModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "users",
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [PermissionAminGuard]
      }
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
