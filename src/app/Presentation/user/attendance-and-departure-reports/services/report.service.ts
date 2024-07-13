import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }
  GetEmployeeDailyAttendanceGroupByDayPath(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}Report/GetEmployeeDailyAttendanceGroupByDay`,{}, { params: queryParams, responseType: 'blob' })
  }
  getLateEarlyArrivalGroupByDepartmentReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}Report/GetLateEarlyArrivalGroupByDepartmentReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getEmployeeAttendanceByDepartmentReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}Report/GetEmployeeAttendanceByDepartmentReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getAttendaceLeaveStatusShortGroupByJobReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}Report/GetAttendaceLeaveStatusShortGroupByJobReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getAttendanceDetailsByEmployeeIDReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}Report/GetAttendanceDetailsByEmployeeIDReport`,{}, { params: queryParams, responseType: 'blob' })
  }
}
