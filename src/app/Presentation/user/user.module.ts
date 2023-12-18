import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SideNavBarComponent } from 'src/app/layout/side-nav-bar/side-nav-bar.component';
import { CoreModule } from 'src/app/core/core.module';


const routes: Routes = [
  {
    path: '', component: SideNavBarComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'requests',
        loadChildren: () => import('./requests/requests.module').then((m) => m.RequestsModule),
      },
      {
        path: 'employees',
        loadChildren: () => import('./employees/employees.module').then((m) => m.EmployeesModule),
      },
      {
        path: "employment",
        loadChildren: () => import('./department/department.module').then((m) => m.DepartmentModule),
      },


      {
        path: "justificationsType",
        loadChildren: () => import('./justifications-type/justifications-type.module').then((m) => m.JustificationsTypeModule),
      },
      {
        path: "justifications",
        loadChildren: () => import('./justifications/justifications.module').then((m) => m.JustificationsModule),
      },
      {
        path: "groups",
        loadChildren: () => import('./groups/groups.module').then((m) => m.GroupsModule),
      },
      {
        path: "permissionType",
        loadChildren: () => import('./permission-type/permission-type.module').then((m) => m.PermissionTypeModule),
      },
      {
        path: "vacationType",
        loadChildren: () => import('./vacation-type/vacation-type.module').then((m) => m.VacationTypeModule),
      },

      {
        path: "vacations",
        loadChildren: () => import('./vacations/vacations.module').then((m) => m.VacationsModule),
      },
      {
        path: "permissions",
        loadChildren: () => import('./permissions/permissions.module').then((m) => m.PermissionsModule),
      },
      {
        path: "taskType",
        loadChildren: () => import('./task-type/task-type.module').then((m) => m.TaskTypeModule),
      },

      {
        path: "tasks",
        loadChildren: () => import('./tasks/tasks.module').then((m) => m.TasksModule),
      },
      {
        path: "holidays",
        loadChildren: () => import('./holidays/holidays.module').then((m) => m.HolidaysModule),
      },
      {
        path: "assignments",
        loadChildren: () => import('./assignments/assignments.module').then((m) => m.AssignmentsModule),
      },
      {
        path: "sections",
        loadChildren: () => import('./sections/sections.module').then((m) => m.SectionsModule),
      },
      {
        path: "officials",
        loadChildren: () => import('./officials/officials.module').then((m) => m.OfficialsModule),
      },
      {
        path: "shifts",
        loadChildren: () => import('./shifts/shifts.module').then((m) => m.ShiftsModule),
      },
      {
        path: "tables",
        loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule),
      },
      {
        path: "zones",
        loadChildren: () => import('./zones/zones.module').then((m) => m.ZonesModule),
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
