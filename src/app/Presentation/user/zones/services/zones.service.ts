import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  private translationData: any;

  constructor(private http: HttpClient) { }
  listZones(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Zone/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}Zone/GetZonesInformations`).pipe(map(data => data.data));
  }
  createZone(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}Zone/Create`, formData)

  }
  updateZone(formData: any) {

    return this.http.put<any>(`${environment.baseUrl}Zone/Update`, formData)

  }
  deleteZone(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}Employee/Delete`, { params: queryParams })
  }
  disabledZone(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Zone/disable`, {}, { params: queryParams })
  }
  GetForDropDownZone(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Employee/GetForDropDown`, { params: queryParams })

  }
  enabledZone(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}Zone/enable`, {}, { params: queryParams })
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
  ZoneGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Zone/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  ZoneGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Zone/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
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
