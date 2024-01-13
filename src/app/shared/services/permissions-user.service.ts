import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsUserService {
  permission: any = JSON.parse(localStorage.getItem("permissions") as string);

  constructor() { }
  checkPermission(data: any): boolean {
    let check = false
    if (this.permission.isAdmin) {
      check = true
    } else {
      if (data.type === "component") {
        let findIndexPermission = (this.permission.availablePermissions as any[]).findIndex(permission => permission.screenCode === data.screenCode);
        findIndexPermission >= 0 ? check = true : check = false
      } else {
        let findIndexPermission = (this.permission.availablePermissions as any[]).findIndex(permission => permission.screenCode === data.screenCode);

        let checkActionCode = (this.permission.availablePermissions[findIndexPermission].permissionScreenActions as any[]).findIndex(permission => permission.actionCode === data.actionCode)
        checkActionCode >= 0 ? check = true : check = false
      }

    }
    return check
  }
}
