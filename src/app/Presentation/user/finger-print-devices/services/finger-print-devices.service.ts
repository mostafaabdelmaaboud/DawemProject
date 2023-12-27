import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FingerPrintDevicesService {
  constructor(private http: HttpClient) { }
  listFingerprintDevices(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}FingerprintDevice/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}FingerprintDevice/GetFingerprintDevicesInformations`).pipe(map(data => data.data));
  }

  fingerprintForDropdown(params: any) {
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
    return this.http.get<any>(`${environment.baseUrl}FingerprintDevice/GetForDropDown`, { params: queryParams })
  }


  enabledFingerprintDevice(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}FingerprintDevice/enable`, {}, { params: queryParams })
  }

  disabledFingerprintDevice(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}FingerprintDevice/disable`, {}, { params: queryParams })
  }
  createFingerprintDevice(data: any) {
    return this.http.post<any>(`${environment.baseUrl}FingerprintDevice/Create`, data)
  }
  updateFingerprintDevice(data: any) {
    return this.http.put<any>(`${environment.baseUrl}FingerprintDevice/Update`, data)
  }
  fingerprintDeviceGetById(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}FingerprintDevice/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  fingerprintDeviceGetInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}FingerprintDevice/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
}
