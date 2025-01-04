import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OvertimeTypeService {


  constructor(private http: HttpClient) { }
  listOverTime(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}OvertimeType/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}OvertimeType/GetOvertimeTypesInformations`).pipe(map(data => data.data));
  }
  deleteOverTime(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}OvertimeType/delete`, { params: queryParams })
  }
  overtimeGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}OvertimeType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createOvertime(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}OvertimeType/Create`, formData)

  }
  updateOvertime(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}OvertimeType/Update`, formData)

  }

  overtimeGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}OvertimeType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  overtimeTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}OvertimeType/GetForDropDown`, { params: queryParams })
  }
}
