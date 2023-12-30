import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {

  constructor(private http: HttpClient) { }
  listHolidays(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Holiday/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}Holiday/GetHolidaiesInformations`).pipe(map(data => data.data));
  }
  holidayGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Holiday/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  disableHoliday(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Holiday/disable`, {}, { params: queryParams })
  }

  createHoliday(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}Holiday/Create`, formData)

  }
  updateHoliday(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}Holiday/Update`, formData)

  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Holiday/enable`, {}, { params: queryParams })

  }
  holidayGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Holiday/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  holidaysTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Holiday/GetForDropDown`, { params: queryParams })
  }
}
