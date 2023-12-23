import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskTypeService {


  constructor(private http: HttpClient) { }
  listTasks(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}TaskType/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}TaskType/GetTaskTypesInformations`).pipe(map(data => data.data));
  }
  deleteTask(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}TaskType/delete`, { params: queryParams })
  }
  taskGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}TaskType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createTask(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}TaskType/Create`, formData)

  }
  updateTask(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}TaskType/Update`, formData)

  }

  taskGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}TaskType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  taskTypeDropdown(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}TaskType/GetForDropDown`, { params: queryParams })
  }
}
