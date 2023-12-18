import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JustificationsTypeService {


  constructor(private http: HttpClient) { }
  listJustification(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JustificationType/Get`, { params: queryParams })
  }
  deleteJusification(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}JustificationType/delete`, { params: queryParams })
  }
  jusificationGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JustificationType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createJusification(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}JustificationType/Create`, formData)

  }
  updateJusification(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}JustificationType/Update`, formData)

  }

  jusificationGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JustificationType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  jusificationTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JustificationType/GetForDropDown`, { params: queryParams })
  }
}
