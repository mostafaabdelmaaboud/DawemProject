import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionAminGuard implements CanActivate {
  constructor(private permissionsUserService: PermissionsUserService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      debugger;
    if (state.url.includes("Companies")) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: 0 });
    } else if (state.url.includes("userPermissions")) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: 1 });
    } else if (state.url.includes("PermissionLog")) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: 2 });
    } else if (state.url.includes("responsibility")) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: 3 });
    } else if (state.url.includes("plans")) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: 4 });
    } else if (state.url.includes("subscriptions")) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: 5 });
    } else if (state.url.includes("admin/users")) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: 6 });
    }else if (state.url.includes("subscriptionsPayments")) {
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: 7 });
    }else {
      return false;
      this.router.navigate(["/notPermission"])
    }
    
  }

}
