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
        path: "subscriptions",
        loadChildren: () => import('./subscriptions/subscriptions.module').then((m) => m.SubscriptionsModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "userPermissions",
        loadChildren: () => import('./user-permissions/user-permissions.module').then((m) => m.UserPermissionsModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "plans",
        loadChildren: () => import('./plans/plans.module').then((m) => m.PlansModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "users",
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "PermissionLog",
        loadChildren: () => import('./permission-log/permission-log.module').then((m) => m.PermissionLogModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "subscriptionsPayments",
        loadChildren: () => import('./subscriptions-payments/subscriptions-payments.module').then((m) => m.SubscriptionsPaymentsModule),
        canActivate: [PermissionAminGuard]
      },
      
      {
        path: "Companies",
        loadChildren: () => import('./companies/companies.module').then((m) => m.CompaniesModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "settings",
        loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
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
