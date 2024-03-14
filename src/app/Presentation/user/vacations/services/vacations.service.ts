import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacationsService {


  constructor(private http: HttpClient) { }
  listVacations(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestVacation/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}RequestVacation/GetVacationsInformations`).pipe(map(data => data.data));
  }
  deleteVacation(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}RequestVacation/Delete`, { params: queryParams })
  }
  vacationGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestVacation/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  rejectVacation(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}RequestVacation/Reject`, {}, { params: queryParams })
  }

  createVacation(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}RequestVacation/Create`, formData)

  }
  updateVacation(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}RequestVacation/Update`, formData)

  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}RequestVacation/Accept`, {}, { params: queryParams })

  }
  vacationGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestVacation/GetById`, { params: queryParams }).pipe(map(data => data.data))
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
