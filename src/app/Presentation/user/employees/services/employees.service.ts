import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private http: HttpClient) { }
  listEmployees(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Employee/Get`, { params: queryParams })
  }
  createEmployee(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}Employee/Create`, formData)

  }
  updateEmployee(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}Employee/Update`, formData)

  }
  deleteEmployee(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}Employee/Delete`, { params: queryParams })
  }
  disabledEmployee(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Employee/Disable`, {}, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}Employee/GetEmployeesInformations`).pipe(map(data => data.data));
  }
  GetForDropDownEmployee(params: any) {
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
  GetForDropDownDepartment(params: any) {
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
    return this.http.get<any>(`${environment.baseUrl}Department/GetForDropDown`, { params: queryParams })

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
  GetForDropDownJobTitle(params: any) {
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
    return this.http.get<any>(`${environment.baseUrl}JobTitle/GetForDropDown`, { params: queryParams })

  }
  
  enabledEmployee(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Employee/Enable`, {}, { params: queryParams })
  }
  getJobTitles(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}JobTitle/GetForDropDown`, { params: queryParams })

  }
  getDepartmentForDropDown(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Department/GetForDropDown`, { params: queryParams })

  }
  getScheduleForDropDown(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Schedule/GetForDropDown`, { params: queryParams })
  }
  employeeGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Employee/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  employeeGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Employee/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  downloadImage(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'arraybuffer' })

  }
  exportDraft(): any {
    return this.http.get<any>(`${environment.baseUrl}Employee/CreateExportDraft`, {observe:'response', responseType:'blob' as 'json'})
  }
  importDataFromExcel(formData:FormData): any {
    return this.http.post<any>(`${environment.baseUrl}Employee/CreateImportDataFromExcel`,formData,  {
      reportProgress: true,
      observe: "events",
    });
  }
}
