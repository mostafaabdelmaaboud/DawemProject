import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponsibilityService {

  constructor(private http: HttpClient) { }
  getResponsibility(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JobTitle/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}Responsibility/GetResponsibilitiesInformations`).pipe(map(data => data.data));
  }
  disableResponsibility(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Responsibility/disable`, {}, { params: queryParams })
  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Responsibility/enable`, {}, { params: queryParams })

  }
  responsibilityInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Responsibility/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createResponsibility(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}Responsibility/Create`, formData)

  }
  updateResponsibility(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}Responsibility/Update`, formData)

  }

  responsibilityGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Responsibility/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  jobTitleTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JobTitle/GetForDropDown`, { params: queryParams })
  }
}
