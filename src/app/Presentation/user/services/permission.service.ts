import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor() { }
  isAllowed(permissions: any[]) {
    const user: any = JSON.parse(localStorage.getItem("usersMe") as string);
    const userType = user?.type;

    // const user: { permission: Permission } = {
    //   permission: "Front Line Staff"
    // }
    return permissions.includes(userType);
  }
}
