import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  constructor(private http: HttpClient) { }
  listAssignment(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestAssignment/Get`, { params: queryParams })
  }

  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}RequestAssignment/GetAssignmentsInformations`).pipe(map(data => data.data));
  }
  assignmentGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestAssignment/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  rejectAssignment(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}RequestAssignment/Reject`, {}, { params: queryParams })
  }

  createAssignment(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}RequestAssignment/Create`, formData)

  }
  updateAssignment(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}RequestAssignment/Update`, formData)

  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}RequestAssignment/Accept`, {}, { params: queryParams })

  }
  assignmentGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}RequestAssignment/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  assignmentTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}AssignmentType/GetForDropDown`, { params: queryParams })
  }
}
