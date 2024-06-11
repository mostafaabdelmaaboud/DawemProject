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
      return this.permissionsUserService.checkPermissionAdmin({ type: "component", screenCode: Number(route?.paramMap?.get('id')) }) ? true : false;


    
  }

}
