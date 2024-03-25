import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  constructor(private http: HttpClient) { }
  listSections(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Department/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}Department/GetDepartmentsInformations`).pipe(map(data => data.data));
  }
  createSection(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}Department/Create`, formData)

  }
  updateSection(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}Department/Update`, formData)

  }
  GetForDropDownDepartment(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Department/GetForDropDown`, { params: queryParams })

  }
  getForTree(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Department/GetForTree`, { params: queryParams })

  }
  sectionGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Department/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }

  GetForDropDownEmployees(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        if (key === "ids") {
          value.forEach((id: any) => {
            queryParams = queryParams.append(key, id)

          });
        } else {
          queryParams = queryParams.set(key, value);

        }
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Employee/GetForDropDown`, { params: queryParams })

  }
  GetForDropDownZones(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        if (key === "ids") {
          value.forEach((id: any) => {
            queryParams = queryParams.append(key, id)

          });
        } else {
          queryParams = queryParams.set(key, value);

        }
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Zone/GetForDropDown`, { params: queryParams })

  }
  sectionGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Department/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  enableSection(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Department/enable`, {}, { params: queryParams })
  }
  disabledSection(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Department/disable`, {}, { params: queryParams })
  }
  exportDraft(): any {
    return this.http.get<any>(`${environment.baseUrl}Department/CreateExportDraft`, {observe:'response', responseType:'blob' as 'json'})
  }
  importDataFromExcel(formData:FormData): any {
    return this.http.post<any>(`${environment.baseUrl}Department/CreateImportDataFromExcel`,formData,  {
      reportProgress: true,
      observe: "events",
    });
  }
}
