import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  constructor(private http: HttpClient) { }
  listShifts(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}ShiftWorkingTime/Get`, { params: queryParams })
  }
  deleteShift(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}ShiftWorkingTime/delete`, { params: queryParams })
  }
  createShift(data: any) {

    return this.http.post<any>(`${environment.baseUrl}ShiftWorkingTime/Create`, data)

  }
  updateShift(data: any) {

    return this.http.put<any>(`${environment.baseUrl}ShiftWorkingTime/Update`, data)

  }
  shiftsGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}ShiftWorkingTime/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  shiftsGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}ShiftWorkingTime/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
}
