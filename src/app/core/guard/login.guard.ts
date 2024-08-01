import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem("token")) {  
      let parseJson = JSON.parse(localStorage.getItem("permissions") as string);
      if (parseJson.isAdmin || parseJson.availablePermissions.length > 0) {
          if(parseJson.availablePermissions?.[0]?.screenCode >=0) {
            this.router.navigate([`${parseJson.availablePermissions?.[0]?.url}/${parseJson.availablePermissions?.[0]?.screenCode}`]);
          }
      }
      return false;
    }
    return true;
  }

}
