import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JustificationsService {

  constructor(private http: HttpClient) { }
  listJustifications(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestJustification/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}RequestJustification/GetJustificationsInformations`).pipe(map(data => data.data));
  }
  JustificationGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestJustification/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  deleteJustification(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}JustificationType/delete`, { params: queryParams })
  }
  rejectJustification(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}RequestJustification/Reject`, {}, { params: queryParams })
  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}RequestJustification/Accept`, {}, { params: queryParams })

  }
  updateJustification(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}RequestJustification/Update`, formData)

  }
  createJustification(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}RequestJustification/Create`, formData)

  }
  jusificationTypeDropdown(filter: any) {
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
    return this.http.get<any>(`${environment.baseUrl}JustificationType/GetForDropDown`, { params: queryParams })
  }
}
