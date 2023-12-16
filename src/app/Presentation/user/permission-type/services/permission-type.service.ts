import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionTypeService {


  constructor(private http: HttpClient) { }
  listPermission(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}PermissionType/Get`, { params: queryParams })
  }
  deletePermission(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}PermissionType/delete`, { params: queryParams })
  }
  permissionGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}PermissionType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createPermission(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}PermissionType/Create`, formData)

  }
  updatePermission(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}PermissionType/Update`, formData)

  }

  permissionGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}PermissionType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  permissionTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}PermissionType/GetForDropDown`, { params: queryParams })
  }
}
