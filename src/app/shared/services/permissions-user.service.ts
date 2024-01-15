import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsUserService {

  constructor(private authService: AuthService) { }
  getPermissions(): any {
    const permissionsString = localStorage.getItem('permissions') as string;

    try {
      // حاول تحويل القيمة إلى كائن JSON
      return JSON.parse(permissionsString);
    } catch (error) {
      // إذا كان هناك أي خطأ، فقط أرجع القيمة النصية
      return permissionsString;
    }
  }

  checkPermission(data: any): boolean {
    let check = false

    if (this.getPermissions()?.isAdmin) {
      check = true
    } else {


      if (data?.type === "component") {
        if ((this.getPermissions()?.availablePermissions as any[])?.length > 0) {
          let findIndexPermission = (this.getPermissions().availablePermissions as any[]).findIndex(permission => permission.screenCode === data.screenCode);
          findIndexPermission >= 0 ? check = true : check = false
        } else {
          this.authService.logout();

        }

      } else {


        if ((this.getPermissions()?.availablePermissions as any[])?.length > 0) {
          let findIndexPermission = (this.getPermissions().availablePermissions as any[]).findIndex(permission => permission.screenCode === data.screenCode);

          let checkActionCode = (this.getPermissions().availablePermissions[findIndexPermission].permissionScreenActions as any[]).findIndex(permission => permission.actionCode === data.actionCode)
          checkActionCode >= 0 ? check = true : check = false
        } else {
          this.authService.logout();

        }

      }

    }
    return check
  }
}
