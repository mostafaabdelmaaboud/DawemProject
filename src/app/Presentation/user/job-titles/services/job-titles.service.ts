import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobTitlesService {

  constructor(private http: HttpClient) { }
  listJobTitles(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JobTitle/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}JobTitle/GetJobTitlesInformations`).pipe(map(data => data.data));
  }
  deleteJobTitle(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}JobTitle/delete`, { params: queryParams })
  }
  jobTitleGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JobTitle/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createJobTitle(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}JobTitle/Create`, formData)

  }
  updateJobTitle(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}JobTitle/Update`, formData)

  }

  jobTitleGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JobTitle/GetById`, { params: queryParams }).pipe(map(data => data.data))
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
