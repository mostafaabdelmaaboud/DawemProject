import { NgModule } from '@angular/core';
import {  Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { PermissionAminGuard } from 'src/app/core/guard/permission-admin.guard';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { InputTextModule } from 'primeng/inputtext';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import {MatMenuModule} from '@angular/material/menu';
import { TabViewModule } from 'primeng/tabview';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatExpansionModule } from '@angular/material/expansion';
import { SideNavBarAdminComponent } from 'src/app/layout/side-nav-bar-admin/side-nav-bar-admin.component';
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
        path: "responsibility/:id",
        loadChildren: () => import('./responsibility/responsibility.module').then((m) => m.ResponsibilityModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "subscriptions/:id",
        loadChildren: () => import('./subscriptions/subscriptions.module').then((m) => m.SubscriptionsModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "userPermissions/:id",
        loadChildren: () => import('./user-permissions/user-permissions.module').then((m) => m.UserPermissionsModule),
        canActivate: [PermissionAminGuard]
      },
      
      {
        path: "plans/:id",
        loadChildren: () => import('./plans/plans.module').then((m) => m.PlansModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "users/:id",
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "PermissionLog/:id",
        loadChildren: () => import('./permission-log/permission-log.module').then((m) => m.PermissionLogModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "subscriptionsPayments/:id",
        loadChildren: () => import('./subscriptions-payments/subscriptions-payments.module').then((m) => m.SubscriptionsPaymentsModule),
        canActivate: [PermissionAminGuard]
      },
      
      {
        path: "Companies/:id",
        loadChildren: () => import('./companies/companies.module').then((m) => m.CompaniesModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "settings/:id",
        loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "Screens/:id",
        loadChildren: () => import('./screens/screens.module').then((m) => m.ScreensModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "ScreenGroup/:id",
        loadChildren: () => import('./screen-groups/screen-groups.module').then((m) => m.ScreenGroupsModule),
        canActivate: [PermissionAminGuard]
      },
      {
        path: "vacationTypesDefault/:id",
        loadChildren: () => import('./defaultLookups/vacation-type-default/vacation-type-default.module').then((m) => m.VacationTypeDefaultModule),
        // canActivate: [PermissionAminGuard]
      },
      {
        path: "jobTitlesDefault/:id",
        loadChildren: () => import('./defaultLookups/job-titles-default/job-titles-default.module').then((m) => m.JobTitlesDefaultModule),
        // canActivate: [PermissionAminGuard]
      },
      {
        path: "departmentsDefault/:id",
        loadChildren: () => import('./defaultLookups/departments-default/departments-default.module').then((m) => m.DepartmentsDefaultModule),
        // canActivate: [PermissionAminGuard]
      },
      {
        path: "officialHolidayDefault/:id",
        loadChildren: () => import('./defaultLookups/official-holiday-default/official-holiday-default.module').then((m) => m.OfficialHolidayDefaultModule),
        // canActivate: [PermissionAminGuard]
      },
      {
        path: "taskTypeDefault/:id",
        loadChildren: () => import('./defaultLookups/task-type-default/task-type-default.module').then((m) => m.TaskTypeDefaultModule),
        // canActivate: [PermissionAminGuard]
      },
      {
        path: "permissionTypeDefault/:id",
        loadChildren: () => import('./defaultLookups/permission-type-default/permission-type-default.module').then((m) => m.PermissionTypeDefaultModule),
        // canActivate: [PermissionAminGuard]
      },
      {
        path: "justificationTypeDefault/:id",
        loadChildren: () => import('./defaultLookups/justification-type-default/justification-type-default.module').then((m) => m.JustificationTypeDefaultModule),
        // canActivate: [PermissionAminGuard]
      },
      {
        path: "shiftTypeDefault/:id",
        loadChildren: () => import('./defaultLookups/shift-type-default/shift-type-default.module').then((m) => m.ShiftTypeDefaultModule),
        // canActivate: [PermissionAminGuard]
      },  
      {
        path: "penaltiesDefault/:id",
        loadChildren: () => import('./defaultLookups/penalties-default/penalties-default.module').then((m) => m.PenaltiesDefaultModule),
        // canActivate: [PermissionAminGuard]
      },
      {
        path: "fingerprintDeviceManagement/:id",
        loadChildren: () => import('./fingerprint-device-management/fingerprint-device-management.module').then((m) => m.FingerprintDeviceManagementModule),
        // canActivate: [PermissionGuard]
      },
    ]
  }
];

@NgModule({
  declarations: [SideNavBarAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    MatMenuModule,
    TabViewModule,
    TranslateModule,
    DropdownModule,
    ScrollingModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    InputSwitchModule,
    MatDialogModule,
    MatListModule,
    NzLayoutModule,
    NzMenuModule,
    MatButtonModule,
    NzIconModule,
    NzSelectModule,
    InputTextModule,
    InfiniteScrollModule,
    MatExpansionModule,
    RouterModule.forChild(routes),

  ]
})
export class AdminModule { }
