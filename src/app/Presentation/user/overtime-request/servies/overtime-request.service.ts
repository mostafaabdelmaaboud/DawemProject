import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OvertimeRequestService {

  constructor(private http: HttpClient) { }
  listOvertimeRequest(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestOvertime/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}RequestOvertime/GetOvertimesInformations`).pipe(map(data => data.data));
  }
  overtimeGetInfo(params:any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestOvertime/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  overtimeGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestOvertime/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  deleteJustification(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}RequestOvertime/Delete`, { params: queryParams })
  }
  rejectJustification(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}RequestOvertime/Reject`, {}, { params: queryParams })
  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}RequestOvertime/Accept`, {}, { params: queryParams })

  }
  updateOvertime(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}RequestOvertime/Update`, formData)

  }
  createOvertime(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}RequestOvertime/Create`, formData)

  }
  overtimeTypeDropdown(filter: any) {
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
    return this.http.get<any>(`${environment.baseUrl}OvertimeType/GetForDropDown`, { params: queryParams })
  }
}
