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
        path: 'dashboard/:id',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [PermissionGuard]

      },
      {
        path: 'requests/:id',
        loadChildren: () => import('./requests/requests.module').then((m) => m.RequestsModule),
        canActivate: [PermissionGuard]

      },
      {
        path: 'employees/:id',
        loadChildren: () => import('./employees/employees.module').then((m) => m.EmployeesModule),
        canActivate: [PermissionGuard]

      },
      {
        path: "employment/:id",
        loadChildren: () => import('./department/department.module').then((m) => m.DepartmentModule),
        canActivate: [PermissionGuard]
      },

      {
        path: "schedualPlan/:id",
        loadChildren: () => import('./schedual-plan/schedual-plan.module').then((m) => m.SchedualPlanModule),
        canActivate: [PermissionGuard]

      },
      {
        path: "summons/:id",
        loadChildren: () => import('./summons/summons.module').then((m) => m.SummonsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "summonMissingLogs/:id",
        loadChildren: () => import('./summon-missing-logs/summon-missing-logs.module').then((m) => m.SummonMissingLogsModule),
        canActivate: [PermissionGuard]  

      },
      
      {
        path: "sanctions/:id",
        loadChildren: () => import('./sanctions/sanctions.module').then((m) => m.SanctionsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "justificationsType/:id",
        loadChildren: () => import('./justifications-type/justifications-type.module').then((m) => m.JustificationsTypeModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "justifications/:id",
        loadChildren: () => import('./justifications/justifications.module').then((m) => m.JustificationsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "groups/:id",
        loadChildren: () => import('./groups/groups.module').then((m) => m.GroupsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "jobTitles/:id",
        loadChildren: () => import('./job-titles/job-titles.module').then((m) => m.JobTitlesModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "vacationBalance/:id",
        loadChildren: () => import('./vacation-balance/vacation-balance.module').then((m) => m.VacationBalanceModule),
        canActivate: [PermissionGuard]  

      },

      {
        path: "fingerPrintDevice/:id",
        loadChildren: () => import('./finger-print-devices/finger-print-devices.module').then((m) => m.FingerPrintDevicesModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "assignmentType/:id",
        loadChildren: () => import('./assignment-type/assignment-type.module').then((m) => m.AssignmentTypeModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "permissionType/:id",
        loadChildren: () => import('./permission-type/permission-type.module').then((m) => m.PermissionTypeModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "vacationType/:id",
        loadChildren: () => import('./vacation-type/vacation-type.module').then((m) => m.VacationTypeModule),
        canActivate: [PermissionGuard]  

      },

      {
        path: "vacations/:id",
        loadChildren: () => import('./vacations/vacations.module').then((m) => m.VacationsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "scheduleLogs/:id",
        loadChildren: () => import('./schedule-logs/schedule-logs.module').then((m) => m.ScheduleLogsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "PermissionLog/:id",
        loadChildren: () => import('./permission-log/permission-log.module').then((m) => m.PermissionLogModule),
        canActivate: [PermissionGuard]  

      },
      
      {
        path: "users/:id",
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [PermissionGuard]  

      },

      {
        path: "permissions/:id",
        loadChildren: () => import('./permissions/permissions.module').then((m) => m.PermissionsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "userPermissions/:id",
        loadChildren: () => import('./user-permissions/user-permissions.module').then((m) => m.UserPermissionsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "responsibility/:id",
        loadChildren: () => import('./responsibility/responsibility.module').then((m) => m.ResponsibilityModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "updateCompany/:id",
        loadChildren: () => import('./update-company/update-company.module').then((m) => m.UpdateCompanyModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "taskType/:id",
        loadChildren: () => import('./task-type/task-type.module').then((m) => m.TaskTypeModule),
        canActivate: [PermissionGuard]  

      },

      {
        path: "tasks/:id",
        loadChildren: () => import('./tasks/tasks.module').then((m) => m.TasksModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "holidays/:id",
        loadChildren: () => import('./holidays/holidays.module').then((m) => m.HolidaysModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "assignments/:id",
        loadChildren: () => import('./assignments/assignments.module').then((m) => m.AssignmentsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "sections/:id",
        loadChildren: () => import('./sections/sections.module').then((m) => m.SectionsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "officials/:id",
        loadChildren: () => import('./officials/officials.module').then((m) => m.OfficialsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "shifts/:id",
        loadChildren: () => import('./shifts/shifts.module').then((m) => m.ShiftsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "tables/:id",
        loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "zones/:id",
        loadChildren: () => import('./zones/zones.module').then((m) => m.ZonesModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "reports/:id",
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
        canActivate: [PermissionGuard]  

      },
      {
        path: "attendanceAndDepartureReports/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/attendance-and-departure-report/attendance-and-departure-reports.module').then((m) => m.AttendanceAndDepartureReportsModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "attendanceAndDepartureFromDepartmentReports/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/attendance-and-departure-from-department-report/attendance-and-departure-from-department-report.module').then((m) => m.AttendanceAndDepartureFromDepartmentReportModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "attendanceAndDepartureReports/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/attendance-and-departure-report/attendance-and-departure-reports.module').then((m) => m.AttendanceAndDepartureReportsModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "SummaryOfAttendanceAndDepartureReports/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/summary-of-attendance-and-departure-report/summary-of-attendance-and-departure-report.module').then((m) => m.SummaryOfAttendanceAndDepartureReportModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "EarlyAndLateAttendanceRepoers/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/early-and-late-attendance/early-and-late-attendance.module').then((m) => m.EarlyAndLateAttendanceModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "AttendanceAndDepartureDetailsReports/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/attendance-and-departure-details/attendance-and-departure-details.module').then((m) => m.AttendanceAndDepartureDetailsModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "LateEarlyArrivalGroupByEmployee/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/late-early-arrival-group-by-employee/late-early-arrival-group-by-employee.module').then((m) => m.LateEarlyArrivalGroupByEmployeeModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "EmployeeAbsenseInPeriodGroupByEmployee/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/employee-absense-in-period-group-by-employee-report/employee-absense-in-period-group-by-employee-report.module').then((m) => m.EmployeeAbsenseInPeriodGroupByEmployeeReportModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "EmployeeAbsenseInPeriodGroupByDepartment/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/get-employee-absense-in-period-group-by-department-report/get-employee-absense-in-period-group-by-department-report.module').then((m) => m.GetEmployeeAbsenseInPeriodGroupByDepartmentReportModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "OverTimeInSelectedPeriod/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/over-time-in-selected-period-report/over-time-in-selected-period-report.module').then((m) => m.OverTimeInSelectedPeriodReportModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "AttendaceLeaveSummary/:id",
        loadChildren: () => import('./attendance-and-departure-reports/components/attendace-leave-summary-report/attendace-leave-summary-report.module').then((m) => m.AttendaceLeaveSummaryReportModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "SummonsDetailsGroupByEmployee/:id",
        loadChildren: () => import('./summons-reports/components/summons-details-group-by-employee/summons-details-group-by-employee.module').then((m) => m.SummonsDetailsGroupByEmployeeModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "SummonsDetailsInPeriod/:id",
        loadChildren: () => import('./summons-reports/components/summons-details-in-period/summons-details-in-period.module').then((m) => m.SummonsDetailsInPeriodModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "BriefingSummonsInPeriodReport/:id",
        loadChildren: () => import('./summons-reports/components/briefing-summons-in-period-report/briefing-summons-in-period-report.module').then((m) => m.BriefingSummonsInPeriodReportModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "StatisticsOverAperiod/:id",
        loadChildren: () => import('./statistics-reports/components/statistics-over-aperiod/statistics-over-aperiod.module').then((m) => m.StatisticsOverAperiodModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "StatisticsReportOverAperiodByDepartment/:id",
        loadChildren: () => import('./statistics-reports/components/statistics-report-over-aperiod-by-department/statistics-report-over-aperiod-by-department.module').then((m) => m.StatisticsReportOverAperiodByDepartmentModule),
        // canActivate: [PermissionGuard]  

      },
      {
        path: "StatisticsReportOverAperiodGroupByMonth/:id",
        loadChildren: () => import('./statistics-reports/components/statistics-report-over-aperiod-group-by-month/statistics-report-over-aperiod-group-by-month.module').then((m) => m.StatisticsReportOverAperiodGroupByMonthModule),
        // canActivate: [PermissionGuard]  

      },
      
      
      
      
      // {
      //   path: "basicDataReports/:id",
      //   loadChildren: () => import('./basic-data-reports/basic-data-reports.module').then((m) => m.BasicDataReportsModule),
      //   canActivate: [PermissionGuard]  

      // },
      // {
      //   path: "delayReports/:id",
      //   loadChildren: () => import('./delay-reports/delay-reports.module').then((m) => m.DelayReportsModule),
      //   canActivate: [PermissionGuard]  

      // },
      // {
      //   path: "absenceReports/:id",
      //   loadChildren: () => import('./absence-reports/absence-reports.module').then((m) => m.AbsenceReportsModule),
      //   canActivate: [PermissionGuard]  

      // },
      // {
      //   path: "overtimeReports/:id",
      //   loadChildren: () => import('./overtime-reports/overtime-reports.module').then((m) => m.OvertimeReportsModule),
      //   canActivate: [PermissionGuard]  

      // },
      // {
      //   path: "recallReports/:id",
      //   loadChildren: () => import('./recall-reports/recall-reports.module').then((m) => m.RecallReportsModule),
      //   canActivate: [PermissionGuard]  

      // },
      // {
      //   path: "statisticsReports/:id",
      //   loadChildren: () => import('./statistics-reports/statistics-reports.module').then((m) => m.StatisticsReportsModule),
      //   canActivate: [PermissionGuard]  

      // },
      
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
