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
    return this.http.get<any>(`${environment.baseUrl}Permission/Get`, { params: queryParams })
  }
  availableActions(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Permission/GetAllScreensWithAvailableActions`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}Permission/GetPermissionsInformations`).pipe(map(data => data.data));
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
    return this.http.get<any>(`${environment.baseUrl}Employee/GetForDropDown`, { params: queryParams })

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
    return this.http.get<any>(`${environment.baseUrl}User/GetForDropDown`, { params: queryParams })
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
    return this.http.get<any>(`${environment.baseUrl}Department/GetForDropDown`, { params: queryParams })
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
    return this.http.get<any>(`${environment.baseUrl}Schedule/GetForDropDown`, { params: queryParams })
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
    return this.http.get<any>(`${environment.baseUrl}Role/GetForDropDown`, { params: queryParams })

  }
  enabledSchedualPlan(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Group/enable`, {}, { params: queryParams })
  }


  disabledSchedualPlan(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Group/disable`, {}, { params: queryParams })
  }
  createPermission(data: any) {

    return this.http.post<any>(`${environment.baseUrl}Permission/Create`, data)

  }
  updateSchedualPlan(data: any) {

    return this.http.put<any>(`${environment.baseUrl}SchedulePlan/Update`, data)

  }
  schedualPlanGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}SchedulePlan/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  schedualPlanGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}SchedulePlan/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
}
