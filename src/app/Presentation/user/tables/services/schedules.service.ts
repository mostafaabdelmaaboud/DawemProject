import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  constructor(private http: HttpClient) { }
  listSchedules(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Schedule/Get`, { params: queryParams })
  }
  scheduleGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Schedule/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  GetForDropDown(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}ShiftWorkingTime/GetForDropDown`, { params: queryParams })

  }
  GetWeekDays() {

    return this.http.get<any>(`${environment.baseUrl}General/GetWeekDays`)

  }

  deleteSchedule(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}Schedule/Delete`, { params: queryParams })
  }
  createSchedule(data: any) {

    return this.http.post<any>(`${environment.baseUrl}Schedule/Create`, data)

  }
  updateSchedule(data: any) {

    return this.http.put<any>(`${environment.baseUrl}Schedule/Update`, data)

  }
  scheduleGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Schedule/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
}
