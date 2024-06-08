import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionsService {
  constructor(private http: HttpClient) { }
  listPermissions(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Permission/Get`, { params: queryParams })
  }
  availableActions(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Permission/GetAllScreensWithAvailableActions`, { params: queryParams })
  }
  getAllScreensWithAvailableActions(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Screen/GetAllScreensWithAvailableActions`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}adminpanel/Permission/GetPermissionsInformations`).pipe(map(data => data.data));
  }
  GetForDropDown(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        if (key === "ids") {
          value.forEach((id: any) => {
            queryParams = queryParams.append(key, id)

          });
        } else {
          queryParams = queryParams.set(key, value);

        }
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Employee/GetForDropDown`, { params: queryParams })

  }
  usersForDropdown(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        if (key === "ids") {
          value.forEach((id: any) => {
            queryParams = queryParams.append(key, id)

          });
        } else {
          queryParams = queryParams.set(key, value);

        }
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/User/GetForDropDown`, { params: queryParams })
  }
  deletePermission(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/Permission/delete`, { params: queryParams })
  }
  departmentForDropdown(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        if (key === "ids") {
          value.forEach((id: any) => {
            queryParams = queryParams.append(key, id)

          });
        } else {
          queryParams = queryParams.set(key, value);

        }
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Department/GetForDropDown`, { params: queryParams })
  }
  schedualForDropdown(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        if (key === "ids") {
          value.forEach((id: any) => {
            queryParams = queryParams.append(key, id)

          });
        } else {
          queryParams = queryParams.set(key, value);

        }
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Schedule/GetForDropDown`, { params: queryParams })
  }
  GetForDropDownRole(params: any) {
    let queryParams = new HttpParams();

    if (params) {

      Object.entries(params).forEach(([key, value]: any) => {
        if (key === "ids") {
          value.forEach((id: any) => {
            queryParams = queryParams.append(key, id)

          });
        } else {
          queryParams = queryParams.set(key, value);

        }
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Responsibility/GetForDropDown`, { params: queryParams })

  }



  createPermission(data: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/Permission/Create`, data)

  }
  updatePermission(data: any) {

    return this.http.put<any>(`${environment.baseUrl}adminpanel/Permission/Update`, data)

  }
  permissionGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Permission/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  permissionGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Permission/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  checkAndGetPermission(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Permission/CheckAndGetPermission`, { params: queryParams }).pipe(map(data => data.data))

  }

}
