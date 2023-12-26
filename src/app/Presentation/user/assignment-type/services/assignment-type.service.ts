import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentTypeService {


  constructor(private http: HttpClient) { }
  listAssignments(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}AssignmentType/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}AssignmentType/GetAssignmentTypesInformations`).pipe(map(data => data.data));
  }
  deleteAssignment(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}AssignmentType/delete`, { params: queryParams })
  }
  assignmentGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}AssignmentType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createAssignment(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}AssignmentType/Create`, formData)

  }
  updateAssignment(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}AssignmentType/Update`, formData)

  }

  assignmentGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}AssignmentType/GetById`, { params: queryParams }).pipe(map(data => data.data))
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
