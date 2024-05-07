import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  constructor(private http: HttpClient) { }
  getCompanies(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Company/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}adminpanel/Company/GetCompaniesInformations`).pipe(map(data => data.data));
  }
  createCompany(formData: FormData) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/Company/Create`, formData)

  }
  updateCompany(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}adminpanel/Company/Update`, formData)

  }
  GetCountries(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Lookups/GetCountries`, { params: queryParams })
  }
  companyDisable(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/Company/Disable`, {}, { params: queryParams })
  }
  accept(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/Company/Enable?`, {}, { params: queryParams })

  }
  getCompanyById(params:any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Company/GetById`, { params: queryParams }).pipe(map(data => data.data));
  }
  CompanyInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Company/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }


  createResponsibility(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/Responsibility/Create`, formData)

  }
  updateResponsibility(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}adminpanel/Responsibility/Update`, formData)

  }

  responsibilityGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Responsibility/GetById`, { params: queryParams }).pipe(map(data => data.data))
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
