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
    return this.http.post(`${environment.baseUrl}EmployeeDailyAttendanceGroupByDay/GetEmployeeDailyAttendanceGroupByDay`,{}, { params: queryParams, responseType: 'blob' })
  }
  getLateEarlyArrivalGroupByDepartmentReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}LateEarlyArrivalGroupByDepartment/GetLateEarlyArrivalGroupByDepartmentReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getEmployeeAttendanceByDepartmentReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}EmployeeAttendanceByDepartmentEmployeeAttendanceByDepartment/GetEmployeeAttendanceByDepartmentReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getAttendaceLeaveStatusShortGroupByJobReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}AttendaceLeaveStatusShortGroupByJob/GetAttendaceLeaveStatusShortGroupByJobReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getAttendanceDetailsByEmployeeIDReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}AttendanceDetailsByEmployeeID/GetAttendanceDetailsByEmployeeIDReport`,{}, { params: queryParams, responseType: 'blob' })
  }


  // الحضور مبكرا او متأخرا بالموظفين
  getLateEarlyArrivalGroupByEmployeeReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}LateEarlyArrivalGroupByEmployee/GetLateEarlyArrivalGroupByEmployeeReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  // غياب الموظفين فى فتره 
  getEmployeeAbsenseInPeriodGroupByEmployeeReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}EmployeeAbsenseInPeriodGroupByEmployee/GetEmployeeAbsenseInPeriodGroupByEmployeeReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  // غياب الموظفين فى فتره بالقسم
  getEmployeeAbsenseInPeriodGroupByDepartmentReport(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}EmployeeAbsenseInPeriodGroupByDepartment/GetEmployeeAbsenseInPeriodGroupByDepartmentReport`,{}, { params: queryParams, responseType: 'blob' })
  }

}
