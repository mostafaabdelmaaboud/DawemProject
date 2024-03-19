import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(private permissionsUserService: PermissionsUserService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url.includes("dashboard")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 1 });

    } else if (state.url.includes("requests")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 22 });


    } else if (state.url.includes("employees")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 3 });


    } else if (state.url.includes("employment")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 4 });


    } else if (state.url.includes("justificationsType")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 18 });


    } else if (state.url.includes("justifications")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 24 });


    } else if (state.url.includes("zones")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 37 });


    } else if (state.url.includes("vacationType")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 36 });


    } else if (state.url.includes("vacationBalance")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 35 });


    } else if (state.url.includes("vacations")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 27 });


    } else if (state.url.includes("users")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 34 });


    } else if (state.url.includes("scheduleLogs")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 31 });


    } else if (state.url.includes("userPermissions")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 19 });


    } else if (state.url.includes("permissions")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 25 });


    } else if (state.url.includes("tasks")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 26 });


    } else if (state.url.includes("holidays")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 15 });


    } else if (state.url.includes("assignmentType")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 0 });


    } else if (state.url.includes("assignments")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 23 });


    } else if (state.url.includes("schedualPlan")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 30 });


    } else if (state.url.includes("tables")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 29 });


    } else if (state.url.includes("shifts")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 32 });


    } else if (state.url.includes("sections")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 2 });


    } else if (state.url.includes("groups")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 14 });


    } else if (state.url.includes("jobTitles")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 17 });


    } else if (state.url.includes("fingerPrintDevice")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 13 });


    } else if (state.url.includes("permissionType")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 21 });


    } else if (state.url.includes("taskType")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 33 });


    } else if (state.url.includes("summons")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 39 });
    } else if (state.url.includes("sanctions")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 38 });
    }else if (state.url.includes("summonMissingLogs")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 40 });
    }else if (state.url.includes("reports")) {
      return this.permissionsUserService.checkPermission({ type: "component", screenCode: 42 });
    }
    else {
      return false;
      this.router.navigate(["/notPermission"])
    }
  }

}
