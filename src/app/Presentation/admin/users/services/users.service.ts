import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }
  listUsers(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/User/Get`, { params: queryParams })
  }

  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}adminpanel/User/GetUsersInformations`).pipe(map(data => data.data));
  }
  userGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/User/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  deleteUser(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/User/Delete`, { params: queryParams })
  }
  rejectAssignment(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/RequestAssignment/Reject`, {}, { params: queryParams })
  }

  createUser(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/User/Create`, formData)

  }
  updateUser(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}adminpanel/User/Update`, formData)

  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/RequestAssignment/Accept`, {}, { params: queryParams })

  }
  userGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/User/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  getRolesDropdown(filter: any) {
    let queryParams = new HttpParams();

    if (filter) {

      Object.entries(filter).forEach(([key, value]: any) => {
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
}
