import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SideNavBarComponent } from 'src/app/layout/side-nav-bar/side-nav-bar.component';
import { CoreModule } from 'src/app/core/core.module';
import { PermissionGuard } from 'src/app/core/guard/permission.guard';


const routes: Routes = [
  {
    path: '', component: SideNavBarComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [PermissionGuard]
      },
      {
        path: 'requests',
        loadChildren: () => import('./requests/requests.module').then((m) => m.RequestsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: 'employees',
        loadChildren: () => import('./employees/employees.module').then((m) => m.EmployeesModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "employment",
        loadChildren: () => import('./department/department.module').then((m) => m.DepartmentModule),
        canActivate: [PermissionGuard]
      },

      {
        path: "schedualPlan",
        loadChildren: () => import('./schedual-plan/schedual-plan.module').then((m) => m.SchedualPlanModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "justificationsType",
        loadChildren: () => import('./justifications-type/justifications-type.module').then((m) => m.JustificationsTypeModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "justifications",
        loadChildren: () => import('./justifications/justifications.module').then((m) => m.JustificationsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "groups",
        loadChildren: () => import('./groups/groups.module').then((m) => m.GroupsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "jobTitles",
        loadChildren: () => import('./job-titles/job-titles.module').then((m) => m.JobTitlesModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "vacationBalance",
        loadChildren: () => import('./vacation-balance/vacation-balance.module').then((m) => m.VacationBalanceModule),
        canActivate: [PermissionGuard]
      },

      {
        path: "fingerPrintDevice",
        loadChildren: () => import('./finger-print-devices/finger-print-devices.module').then((m) => m.FingerPrintDevicesModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "assignmentType",
        loadChildren: () => import('./assignment-type/assignment-type.module').then((m) => m.AssignmentTypeModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "permissionType",
        loadChildren: () => import('./permission-type/permission-type.module').then((m) => m.PermissionTypeModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "vacationType",
        loadChildren: () => import('./vacation-type/vacation-type.module').then((m) => m.VacationTypeModule),
        canActivate: [PermissionGuard]
      },

      {
        path: "vacations",
        loadChildren: () => import('./vacations/vacations.module').then((m) => m.VacationsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "scheduleLogs",
        loadChildren: () => import('./schedule-logs/schedule-logs.module').then((m) => m.ScheduleLogsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "users",
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [PermissionGuard]
      },

      {
        path: "permissions",
        loadChildren: () => import('./permissions/permissions.module').then((m) => m.PermissionsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "userPermissions",
        loadChildren: () => import('./user-permissions/user-permissions.module').then((m) => m.UserPermissionsModule),
        canActivate: [PermissionGuard]
      },

      {
        path: "taskType",
        loadChildren: () => import('./task-type/task-type.module').then((m) => m.TaskTypeModule),
        canActivate: [PermissionGuard]
      },

      {
        path: "tasks",
        loadChildren: () => import('./tasks/tasks.module').then((m) => m.TasksModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "holidays",
        loadChildren: () => import('./holidays/holidays.module').then((m) => m.HolidaysModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "assignments",
        loadChildren: () => import('./assignments/assignments.module').then((m) => m.AssignmentsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "sections",
        loadChildren: () => import('./sections/sections.module').then((m) => m.SectionsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "officials",
        loadChildren: () => import('./officials/officials.module').then((m) => m.OfficialsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "shifts",
        loadChildren: () => import('./shifts/shifts.module').then((m) => m.ShiftsModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "tables",
        loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule),
        canActivate: [PermissionGuard]
      },
      {
        path: "zones",
        loadChildren: () => import('./zones/zones.module').then((m) => m.ZonesModule),
        canActivate: [PermissionGuard]
      },


    ]
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),

  ]
})
export class UserModule { }
