import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacationTypeService {


  constructor(private http: HttpClient) { }
  listVacations(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}VacationType/Get`, { params: queryParams })
  }
  deleteVacation(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}VacationType/delete`, { params: queryParams })
  }
  vacationGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}VacationType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createVacation(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}VacationType/Create`, formData)

  }
  updateVacation(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}VacationType/Update`, formData)

  }

  vacationGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}VacationType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  vacationTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}VacationType/GetForDropDown`, { params: queryParams })
  }
}
