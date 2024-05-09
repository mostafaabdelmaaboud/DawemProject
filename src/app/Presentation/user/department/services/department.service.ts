import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }
  listAttendance(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Attendance/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}Attendance/GetEmployeesAttendancesInformations`).pipe(map(data => data.data));
  }
  deleteAttendance(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}Attendance/delete`, { params: queryParams })
  }
  departmentGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Attendance/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  exportDraft(): any {
    return this.http.get<any>(`${environment.baseUrl}Attendance/CreateExportDraft`, {observe:'response', responseType:'blob' as 'json'})
  }
  importDataFromExcel(formData:FormData): any {
    return this.http.post<any>(`${environment.baseUrl}Attendance/CreateImportDataFromExcel`,formData,  {
      reportProgress: true,
      observe: "events",
    });
  }
}
