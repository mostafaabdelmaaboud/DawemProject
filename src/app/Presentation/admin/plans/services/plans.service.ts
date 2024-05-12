import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(private http: HttpClient) { }
  getPlans(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Plan/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}adminpanel/Plan/GetPlansInformations`).pipe(map(data => data.data));
  }
  getLanguages(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Lookups/GetLanguages`, { params: queryParams }).pipe(map(data => data.data))
  }
  deletePlan(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/Plan/delete`, { params: queryParams })
  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/Responsibility/enable`, {}, { params: queryParams })

  }
  planeInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Plan/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createPlane(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/Plan/Create`, formData)

  }
  updatePlane(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}adminpanel/Plan/Update`, formData)

  }

  planGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Plan/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  jobTitleTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/JobTitle/GetForDropDown`, { params: queryParams })
  }
}
