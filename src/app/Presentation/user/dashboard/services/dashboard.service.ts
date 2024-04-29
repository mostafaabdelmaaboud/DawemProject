import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  getHeaderInformations() {

    return this.http.get<any>(`${environment.baseUrl}Dashboard/GetHeaderInformations`)
  }
  getEmployeesAttendancesInformations() {
    return this.http.get<any>(`${environment.baseUrl}Dashboard/GetEmployeesAttendancesInformations`).pipe(map(data => data.data))
  }
  getRequestsStatus(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Dashboard/GetRequestsStatus`, { params: queryParams }).pipe(map(data => data.data))
  }
  getEmployeesStatus() {
    return this.http.get<any>(`${environment.baseUrl}Dashboard/GetEmployeesStatus`).pipe(map(data => data.data))
  }
  getInformationProfile() {
    return this.http.get<any>(`${environment.baseUrl}Dashboard/GetHeaderInformations`).pipe(map(data => data.data))

  }
  getEmployeesAttendancesStatus(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Dashboard/GetEmployeesAttendancesStatus`, { params: queryParams })
  }
  getBestEmployees(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Dashboard/GetBestEmployees`, { params: queryParams })
  }
  getDepartmentsInformations(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Dashboard/GetDepartmentsInformations`, { params: queryParams })
  }

}
